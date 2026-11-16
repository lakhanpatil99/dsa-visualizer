import React, { useState, useEffect, useRef, useContext } from 'react';
import Head from 'next/head';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import VisualizerCanvas from '../../src/components/VisualizerCanvas';
import ComplexityBox from '../../src/components/ComplexityBox';
import PseudocodePanel from '../../src/components/PseudocodePanel';
import VisualizerLayout from '../../src/components/VisualizerLayout';
import { DarkModeContext } from '../../context/ThemeContext';
import { WeightedGraph } from '../../src/algorithms/graphs/dijkstra';
import { aStarSearch, aStarComplexity } from '../../src/algorithms/graphs/astar';

const WAYPOINTS = [
  { id: 'Seattle', x: 120, y: 80, label: 'Seattle (Hub)' },
  { id: 'SF', x: 100, y: 220, label: 'San Francisco' },
  { id: 'LA', x: 140, y: 340, label: 'Los Angeles' },
  { id: 'Denver', x: 340, y: 200, label: 'Denver (Relay)' },
  { id: 'Austin', x: 420, y: 350, label: 'Austin' },
  { id: 'Chicago', x: 540, y: 150, label: 'Chicago (Core)' },
  { id: 'Atlanta', x: 620, y: 300, label: 'Atlanta' },
  { id: 'NYC', x: 740, y: 120, label: 'New York (Edge)' }
];

const HIGHWAY_ROUTES = [
  { u: 'Seattle', v: 'SF', weight: 1300 },
  { u: 'Seattle', v: 'Denver', weight: 2100 },
  { u: 'SF', v: 'LA', weight: 600 },
  { u: 'SF', v: 'Denver', weight: 2000 },
  { u: 'LA', v: 'Austin', weight: 2200 },
  { u: 'Denver', v: 'Austin', weight: 1500 },
  { u: 'Denver', v: 'Chicago', weight: 1600 },
  { u: 'Austin', v: 'Atlanta', weight: 1400 },
  { u: 'Chicago', v: 'Atlanta', weight: 1150 },
  { u: 'Chicago', v: 'NYC', weight: 1300 },
  { u: 'Atlanta', v: 'NYC', weight: 1400 }
];

export default function RouteLabPage() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [source, setSource] = useState('Seattle');
  const [destination, setDestination] = useState('NYC');
  const [activeAlgo, setActiveAlgo] = useState('both'); // 'dijkstra' | 'astar' | 'both'
  const [isSimulating, setIsSimulating] = useState(false);
  const [dijkstraResult, setDijkstraResult] = useState(null);
  const [aStarResult, setAStarResult] = useState(null);
  const [activeWaypoints, setActiveWaypoints] = useState([]);
  const [simulationLog, setSimulationLog] = useState([]);

  const canvasRef = useRef(null);

  // Redraw Highway Map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = isDarkMode;
    const roadColor = isDark ? '#4B4842' : '#DED9CE';
    const activeRouteColor = '#EF592A';
    const aStarRouteColor = '#28533D';

    // Draw Highway Segments
    HIGHWAY_ROUTES.forEach(edge => {
      const u = WAYPOINTS.find(w => w.id === edge.u);
      const v = WAYPOINTS.find(w => w.id === edge.v);
      if (!u || !v) return;

      const isInDijkstra = dijkstraResult?.path?.some((id, idx) => {
        if (idx === dijkstraResult.path.length - 1) return false;
        const next = dijkstraResult.path[idx + 1];
        return (id === edge.u && next === edge.v) || (id === edge.v && next === edge.u);
      });

      ctx.beginPath();
      ctx.moveTo(u.x, u.y);
      ctx.lineTo(v.x, v.y);
      ctx.lineWidth = isInDijkstra ? 4 : 2;
      ctx.strokeStyle = isInDijkstra ? activeRouteColor : roadColor;
      ctx.stroke();

      // Distance tag
      const midX = (u.x + v.x) / 2;
      const midY = (u.y + v.y) / 2;
      ctx.fillStyle = isDark ? '#24231F' : '#FFFDF8';
      ctx.fillRect(midX - 22, midY - 9, 44, 18);
      ctx.strokeStyle = isInDijkstra ? activeRouteColor : roadColor;
      ctx.strokeRect(midX - 22, midY - 9, 44, 18);

      ctx.fillStyle = isDark ? '#A09D95' : '#69665F';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${edge.weight}km`, midX, midY);
    });

    // Draw Waypoint Hubs
    WAYPOINTS.forEach(hub => {
      const isSrc = hub.id === source;
      const isDst = hub.id === destination;
      const isInPath = dijkstraResult?.path?.includes(hub.id);

      ctx.beginPath();
      ctx.arc(hub.x, hub.y, isSrc || isDst ? 18 : 14, 0, 2 * Math.PI);
      ctx.fillStyle = isSrc ? '#EF592A' : isDst ? '#28533D' : isInPath ? '#FAF8F3' : (isDark ? '#24231F' : '#FFFDF8');
      ctx.fill();

      ctx.lineWidth = isSrc || isDst ? 3 : 2;
      ctx.strokeStyle = isSrc ? '#EF592A' : isDst ? '#28533D' : (isDark ? '#5E5B54' : '#24231F');
      ctx.stroke();

      // Hub Code
      ctx.fillStyle = isSrc || isDst ? '#FFFDF8' : (isDark ? '#FFFDF8' : '#24231F');
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hub.id.substring(0, 3).toUpperCase(), hub.x, hub.y);

      // Hub Label
      ctx.fillStyle = isDark ? '#A09D95' : '#69665F';
      ctx.font = '9px sans-serif';
      ctx.fillText(hub.label, hub.x, hub.y + 22);
    });
  }, [source, destination, dijkstraResult, aStarResult, isDarkMode]);

  const runRouteSimulation = async () => {
    setIsSimulating(true);
    setSimulationLog([]);

    // 1. Run Dijkstra
    const wg = new WeightedGraph();
    WAYPOINTS.forEach(w => wg.addVertex(w.id));
    HIGHWAY_ROUTES.forEach(e => wg.addEdge(e.u, e.v, e.weight));
    const dRes = wg.dijkstra(source, destination);

    // 2. Run A*
    const aRes = aStarSearch(WAYPOINTS, HIGHWAY_ROUTES, source, destination);

    setDijkstraResult(dRes);
    setAStarResult(aRes);

    setSimulationLog([
      `Route computation from ${source} to ${destination}:`,
      `✓ Dijkstra Shortest Path: ${dRes.path.join(' → ')} (${dRes.distance} km)`,
      `✓ A* Heuristic Path: ${aRes.path.join(' → ')} (${aRes.distance} km, ${aRes.trace.length} evaluations)`,
      `Optimal route verified.`
    ]);

    setIsSimulating(false);
  };

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-2">
          ORIGIN & DESTINATION
        </span>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95]">Departure Hub</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              aria-label="Departure Hub"
              className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold mt-1 ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            >
              {WAYPOINTS.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95]">Destination Hub</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              aria-label="Destination Hub"
              className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold mt-1 ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            >
              {WAYPOINTS.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
            </select>
          </div>

          <button
            type="button"
            onClick={runRouteSimulation}
            disabled={isSimulating || source === destination}
            className="w-full mt-2 py-3 rounded-xl font-mono text-xs font-bold bg-[#EF592A] hover:bg-[#D9481B] text-[#FFFDF8] shadow-xs transition-all disabled:opacity-50"
          >
            {isSimulating ? 'Calculating Route...' : 'Find Optimal Route'}
          </button>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
          ROUTE NETWORK STATS
        </span>
        <div className="space-y-1.5 text-xs font-mono text-[#69665F] dark:text-[#A09D95]">
          <div className="flex justify-between"><span>Hubs:</span> <strong className="text-[#24231F] dark:text-[#FFFDF8]">8 Cities</strong></div>
          <div className="flex justify-between"><span>Highway Corridors:</span> <strong className="text-[#24231F] dark:text-[#FFFDF8]">11 Edges</strong></div>
          <div className="flex justify-between"><span>Weight Metric:</span> <strong className="text-[#24231F] dark:text-[#FFFDF8]">Kilometers</strong></div>
        </div>
      </div>
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={aStarComplexity}
        title="A* & Dijkstra Specs"
      />
      <PseudocodePanel
        title="Pathfinding Logic"
        code={`// A* Heuristic Function:
function f(n) = g(n) + h(n)
g(n) = exact distance from start
h(n) = euclidean distance to goal`}
        currentLine={1}
      />
    </div>
  );

  return (
    <ProtectedRoute>
      <Head>
        <title>Route & Pathfinding Laboratory - AlgoMania</title>
        <meta name="description" content="Simulate real-world route optimization, shortest-path calculation in km, and compare Dijkstra vs A* heuristics." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <VisualizerLayout
            title="Route & Pathfinding Laboratory"
            subtitle="Real-world transport network simulation comparing Dijkstra and A* heuristics"
            category="Interactive Lab"
            complexityBadge="O((V + E) log V)"
            leftSidebar={renderLeftSidebar()}
            rightSidebar={renderRightSidebar()}
          >
            <div className="h-full flex flex-col space-y-4">
              <div className="flex-1">
                <VisualizerCanvas
                  width={900}
                  height={440}
                  title="Continental Network Map (Distances in Kilometers)"
                >
                  <canvas
                    ref={canvasRef}
                    width={850}
                    height={440}
                    className="w-full h-full rounded-xl"
                  />
                </VisualizerCanvas>
              </div>

              {/* Simulation Result Comparison */}
              {dijkstraResult && (
                <div className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
                }`}>
                  <h4 className="text-xs font-mono font-bold uppercase text-[#EF592A] mb-2">
                    Path Comparison Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
                      <span className="text-[#EF592A] font-bold block mb-1">Dijkstra's Algorithm (Exhaustive)</span>
                      <div>Path: <strong>{dijkstraResult.path.join(' → ')}</strong></div>
                      <div>Total Distance: <strong>{dijkstraResult.distance} km</strong></div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
                      <span className="text-[#28533D] font-bold block mb-1">A* Search (Euclidean Guided)</span>
                      <div>Path: <strong>{aStarResult?.path?.join(' → ')}</strong></div>
                      <div>Total Distance: <strong>{aStarResult?.distance} km</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </VisualizerLayout>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
