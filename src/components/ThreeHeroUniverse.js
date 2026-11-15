import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * ThreeHeroUniverse
 * 
 * An interactive, procedural 3D algorithm universe visualizing:
 * - Interconnected Graph Nodes & Edges
 * - Hierarchical Binary Tree Structure
 * - Dynamic Floating Sorting Bars
 * - Orbiting Data Particles
 * 
 * Includes:
 * - Automatic WebGL feature detection & graceful fallback
 * - prefers-reduced-motion detection
 * - IntersectionObserver to pause rendering when out of viewport
 * - Document visibility change listener to pause when backgrounded
 * - Responsive viewport resizing with devicePixelRatio capping
 * - Full memory disposal (geometries, materials, renderer)
 */
export default function ThreeHeroUniverse() {
  const containerRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // 1. Reduced Motion Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // 2. WebGL Support Detection
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch (e) {
      setWebGLSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;

    // 3. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080d1b, 0.015);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 42);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      setWebGLSupported(false);
      return;
    }

    // Interactive Mouse Coordinates
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (event) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 4. Procedural Visualizer Elements
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- A. Central Graph Network (Floating Nodes & Edges) ---
    const nodeCount = window.innerWidth < 768 ? 22 : 44;
    const nodeGeometry = new THREE.SphereGeometry(0.45, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85
    });

    const nodes = [];
    const nodePositions = [];

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const radius = 10 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
      mesh.position.z = radius * Math.cos(phi) * 0.8;

      mesh.userData = {
        originX: mesh.position.x,
        originY: mesh.position.y,
        originZ: mesh.position.z,
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
      };

      rootGroup.add(mesh);
      nodes.push(mesh);
      nodePositions.push(mesh.position);
    }

    // Dynamic Connections between nearby nodes
    const maxLineSegments = nodeCount * 3;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    rootGroup.add(networkLines);

    // --- B. Floating 3D Algorithm Sorting Bars ---
    const barGroup = new THREE.Group();
    const barCount = 18;
    const bars = [];
    const barBoxGeo = new THREE.BoxGeometry(0.6, 1, 0.6);

    for (let i = 0; i < barCount; i++) {
      const heightScale = 1.5 + (i * 0.7) % 8;
      const barColor = new THREE.Color().setHSL(0.55 + (i / barCount) * 0.25, 0.85, 0.55);
      const barMat = new THREE.MeshBasicMaterial({
        color: barColor,
        wireframe: false,
        transparent: true,
        opacity: 0.75
      });
      const bar = new THREE.Mesh(barBoxGeo, barMat);
      bar.scale.set(1, heightScale, 1);
      bar.position.set((i - barCount / 2) * 1.3, -8, -5);
      barGroup.add(bar);
      bars.push({
        mesh: bar,
        baseScale: heightScale,
        speed: 1.2 + (i % 4) * 0.5
      });
    }
    barGroup.position.set(0, -3, 0);
    rootGroup.add(barGroup);

    // --- C. Binary Tree Floating Construct ---
    const treeGroup = new THREE.Group();
    const treeLevels = 4;
    const treeNodes = [];
    let nodeIdx = 0;

    for (let depth = 0; depth < treeLevels; depth++) {
      const countAtDepth = Math.pow(2, depth);
      const spacing = 18 / (countAtDepth + 1);
      for (let j = 0; j < countAtDepth; j++) {
        const tGeo = new THREE.OctahedronGeometry(0.55, 0);
        const tMat = new THREE.MeshBasicMaterial({
          color: 0x8b5cf6,
          wireframe: true,
          transparent: true,
          opacity: 0.65
        });
        const tMesh = new THREE.Mesh(tGeo, tMat);
        const xPos = -9 + (j + 1) * spacing;
        const yPos = 8 - depth * 3.2;
        tMesh.position.set(xPos, yPos, -10);
        treeGroup.add(tMesh);
        treeNodes.push(tMesh);
        nodeIdx++;
      }
    }
    rootGroup.add(treeGroup);

    // --- D. Luminous Ambient Particles ---
    const particleCount = window.innerWidth < 768 ? 80 : 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 60;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      particleScales[i] = Math.random() * 2;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.45,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const particleField = new THREE.Points(particleGeometry, particleMaterial);
    rootGroup.add(particleField);

    // 5. Visibility and Intersection Observer Optimization
    let isRenderingActive = true;

    const observer = new IntersectionObserver(([entry]) => {
      isRenderingActive = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    const handleVisibilityChange = () => {
      isRenderingActive = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 6. Responsive Window Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isRenderingActive) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse camera interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      camera.position.x = mouse.x * 3.5;
      camera.position.y = mouse.y * 2.5;
      camera.lookAt(0, 0, 0);

      // Subtle scene rotation
      rootGroup.rotation.y = elapsedTime * 0.04;
      rootGroup.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Animate graph nodes
      nodes.forEach((node) => {
        const u = node.userData;
        node.position.y = u.originY + Math.sin(elapsedTime * u.speed + u.offset) * 0.8;
        node.position.x = u.originX + Math.cos(elapsedTime * u.speed * 0.8 + u.offset) * 0.6;
      });

      // Update connected edges
      let lineVertexIdx = 0;
      let colorVertexIdx = 0;
      const thresholdDistance = 8.5;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = nodes[i].position.distanceTo(nodes[j].position);
          if (dist < thresholdDistance && lineVertexIdx < maxLineSegments * 6 - 6) {
            const p1 = nodes[i].position;
            const p2 = nodes[j].position;

            linePositions[lineVertexIdx++] = p1.x;
            linePositions[lineVertexIdx++] = p1.y;
            linePositions[lineVertexIdx++] = p1.z;

            linePositions[lineVertexIdx++] = p2.x;
            linePositions[lineVertexIdx++] = p2.y;
            linePositions[lineVertexIdx++] = p2.z;

            const alpha = 1.0 - dist / thresholdDistance;
            // Cyan-to-blue gradient lines
            lineColors[colorVertexIdx++] = 0.2 * alpha;
            lineColors[colorVertexIdx++] = 0.7 * alpha;
            lineColors[colorVertexIdx++] = 1.0 * alpha;

            lineColors[colorVertexIdx++] = 0.5 * alpha;
            lineColors[colorVertexIdx++] = 0.3 * alpha;
            lineColors[colorVertexIdx++] = 0.9 * alpha;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineVertexIdx / 3);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      // Animate sorting bars
      bars.forEach((bar, index) => {
        const scaleCycle = Math.sin(elapsedTime * bar.speed + index * 0.4) * 0.5 + 0.5;
        bar.mesh.scale.y = 1.0 + bar.baseScale * scaleCycle;
        bar.mesh.position.y = -8 + (bar.mesh.scale.y / 2);
      });

      // Animate tree nodes
      treeNodes.forEach((tNode, index) => {
        tNode.rotation.x = elapsedTime * 0.6 + index;
        tNode.rotation.y = elapsedTime * 0.4 + index;
      });

      // Animate particle field
      particleField.rotation.y = -elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Robust Cleanup & Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      // Recursive disposal of scene resources
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {!webGLSupported && (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
}
