/*! AlgoMania intro - single drop-in file, no libraries.
 * Integrated for AlgoMania (https://www.algomania.in)
 * Canonical opening sequence: Selection Sort -> Balanced BST -> Brand Reveal -> Split-Screen Transition
 */
export const ALGOMANIA_INTRO_SCRIPT = `(function () {
  'use strict';
  var CFG = { oncePerSession: true };

  // Allow explicit forced preview via ?intro=1 or ?replay=1 for testing & demos
  var forceIntro = false;
  try {
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      forceIntro = window.location.search.indexOf('intro=1') !== -1 || window.location.search.indexOf('replay=1') !== -1;
    }
  } catch (e) {}

  try {
    if (!forceIntro && CFG.oncePerSession && sessionStorage.getItem('am-intro')) return;
  } catch (e) {}

  var d = document, root = d.documentElement, t0 = performance.now();
  var reduce = false;
  try {
    reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  root.classList.add('am-lock');

  /* ---------- styles ---------- */
  var css = \`
:root{--o:#F05A28;--g:#1F4D3A;--k:#1d2a24;--c:#F7F4EC}
html.am-lock,html.am-lock body{overflow:hidden!important}
#am{position:fixed;inset:0;z-index:2147483000;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--c);-webkit-font-smoothing:antialiased}
#am *{box-sizing:border-box}
.am-p{position:absolute;left:0;right:0;height:50.5%;background:var(--o);transition:transform .85s cubic-bezier(.76,0,.24,1);will-change:transform}
.am-p.t{top:0}.am-p.b{bottom:0}
#am.open .t{transform:translateY(-101%)}#am.open .b{transform:translateY(101%)}
.am-c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(16px*var(--s,1));
  padding:max(env(safe-area-inset-top),18px) 20px max(env(safe-area-inset-bottom),18px);transition:opacity .35s,transform .5s}
#am.out .am-c{opacity:0;transform:scale(1.04)}
.am-c::before{content:"";position:absolute;inset:0;opacity:.1;pointer-events:none;
  background:linear-gradient(var(--c) 1px,transparent 1px) 0 0/calc(44px*var(--s,1)) calc(44px*var(--s,1)),linear-gradient(90deg,var(--c) 1px,transparent 1px) 0 0/calc(44px*var(--s,1)) calc(44px*var(--s,1));
  -webkit-mask:radial-gradient(circle,#000 15%,transparent 72%);mask:radial-gradient(circle,#000 15%,transparent 72%)}
.am-fit{position:relative}
.am-stage{position:absolute;left:0;top:0;width:344px;height:276px;transform-origin:0 0}
.am-stage svg{position:absolute;left:0;top:0;width:344px;height:150px;overflow:visible}
.am-e{stroke:var(--g);stroke-width:2.5;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .5s ease-out}
.am-n{transform-box:fill-box;transform-origin:center;transform:scale(0);transition:transform .45s cubic-bezier(.34,1.56,.64,1)}
.am-n circle{fill:var(--g);stroke:var(--c);stroke-width:2}.am-n.r circle{fill:var(--k);stroke-width:2.6}
.am-n text{fill:var(--c);font:700 11px ui-monospace,Menlo,monospace;text-anchor:middle;dominant-baseline:central}
#am.tree .am-e{stroke-dashoffset:0}#am.tree .am-n{transform:scale(1)}
.am-ring{fill:none;stroke:var(--c);stroke-width:1;stroke-dasharray:3 4;opacity:0;transform-box:fill-box;transform-origin:center}
#am.tree .am-ring{animation:amr 1.6s .2s ease-out}
.am-bar{position:absolute;left:-8px;top:168px;width:360px;height:60px;border-radius:12px;background:var(--k);
  border:2px solid rgba(247,244,236,.9);opacity:0;transition:opacity .4s}
.am-bar.in{opacity:1}
.am-cell{position:absolute;left:0;top:176px;width:44px;height:44px;border-radius:8px;background:var(--g);display:grid;place-items:center;
  font-weight:700;font-size:14px;opacity:0;margin-top:10px;transition:opacity .3s,margin .3s,background .25s,color .25s,box-shadow .25s}
.am-cell.in{opacity:1;margin-top:0}
.am-cell.hi{background:#fff;color:var(--k);box-shadow:0 0 0 2.5px var(--o)}
.am-cell.hj{outline:2px dashed var(--c);outline-offset:-3px}
.am-cell.ok{background:var(--k);box-shadow:inset 0 0 0 1.5px rgba(247,244,236,.85)}
.am-ptr{position:absolute;left:0;width:44px;text-align:center;font-size:9px;line-height:1.3;letter-spacing:.05em;opacity:0;
  transition:transform .22s cubic-bezier(.65,0,.35,1),opacity .3s}
.am-ptr.on{opacity:1}
.am-swap{position:absolute;left:0;top:146px;width:48px;text-align:center;background:var(--k);border-radius:4px;font-size:9px;
  font-weight:700;letter-spacing:.12em;padding:3px 0;opacity:0;transition:opacity .15s}
.am-swap.on{opacity:1}
.am-log{position:relative;width:calc(360px*var(--s,1));max-width:100%;height:calc(16px*var(--s,1));font-size:calc(11px*var(--s,1));letter-spacing:.04em;white-space:nowrap;overflow:hidden}
.am-log::after{content:"";display:inline-block;width:calc(6px*var(--s,1));height:calc(11px*var(--s,1));margin-left:3px;vertical-align:-1px;background:var(--c);animation:amb 1s steps(1) infinite}
.am-brand{position:relative;text-align:center}
.am-w{font:700 calc(50px*var(--s,1))/1.05 Georgia,'Times New Roman',serif;letter-spacing:-.02em;display:flex;justify-content:center;overflow:hidden;padding:0 4px 6px}
.am-w span{display:inline-block;transform:translateY(115%);transition:transform .7s cubic-bezier(.2,.9,.2,1)}
.am-w .m{color:var(--k)}
#am.brand .am-w span{transform:none}
.am-tag{margin-top:calc(8px*var(--s,1));font-size:calc(10px*var(--s,1));letter-spacing:.34em;opacity:0;transition:opacity .6s .45s}
#am.brand .am-tag{opacity:1}
.am-prog{position:absolute;left:0;right:0;bottom:0;height:calc(2px + var(--s,1)*1px);background:rgba(247,244,236,.25);transition:opacity .3s}
.am-prog i{display:block;height:100%;background:var(--c);transform-origin:0 0;transform:scaleX(0)}
.am-pct{position:absolute;right:calc(20px*var(--s,1));bottom:max(env(safe-area-inset-bottom),12px);margin-bottom:calc(10px*var(--s,1));font-size:calc(11px*var(--s,1));letter-spacing:.2em}
.am-skip{position:absolute;left:calc(20px*var(--s,1));bottom:max(env(safe-area-inset-bottom),12px);margin-bottom:calc(6px*var(--s,1));background:none;border:0;color:var(--c);
  font:inherit;font-size:calc(10px*var(--s,1));letter-spacing:.25em;opacity:.75;padding:6px 0;cursor:pointer}
@keyframes amf{to{opacity:1}}@keyframes amb{50%{opacity:0}}@keyframes amr{0%{opacity:.9;transform:scale(.7)}100%{opacity:0;transform:scale(1.9)}}
@media (prefers-reduced-motion:reduce){#am *{transition-duration:.01s!important;animation-duration:.01s!important}}
\`;
  var st = d.createElement('style'); st.id = 'am-css'; st.textContent = css; (d.head || root).appendChild(st);

  /* ---------- markup ---------- */
  var vals = [62, 12, 88, 50, 25, 75, 37], X = function (i) { return i * 50; };
  var nodes = [[50,172,22,0],[25,95,70,1],[75,249,70,1],[12,56,122,2],[37,134,122,2],[62,210,122,2],[88,288,122,2]];
  var edges = [[172,22,95,70,0],[172,22,249,70,0],[95,70,56,122,1],[95,70,134,122,1],[249,70,210,122,1],[249,70,288,122,1]];
  var svg = '<svg viewBox="0 0 344 150" aria-hidden="true">' +
    edges.map(function (e) { return '<line class="am-e" pathLength="1" x1="'+e[0]+'" y1="'+e[1]+'" x2="'+e[2]+'" y2="'+e[3]+'" style="transition-delay:'+(e[4]*.14)+'s"/>'; }).join('') +
    '<circle class="am-ring" cx="172" cy="22" r="22"/>' +
    nodes.map(function (n) { return '<g class="am-n'+(n[3]?'':' r')+'" style="transition-delay:'+(n[3]*.14+.08)+'s"><circle cx="'+n[1]+'" cy="'+n[2]+'" r="'+(n[3]?15:17)+'"/><text x="'+n[1]+'" y="'+n[2]+'">'+n[0]+'</text></g>'; }).join('') + '</svg>';
  var el = d.createElement('div'); el.id = 'am'; el.setAttribute('role', 'status'); el.setAttribute('aria-label', 'Loading AlgoMania');
  el.innerHTML = '<i class="am-p t"></i><i class="am-p b"></i><div class="am-c">' +
    '<div class="am-fit" id="am-fit"><div class="am-stage" id="am-stage">' + svg +
    '<i class="am-bar" id="am-bar"></i><div class="am-swap" id="am-sw">SWAP</div>' +
    '<div class="am-ptr" id="am-pi" style="top:234px">▲<br>ptr i</div><div class="am-ptr" id="am-pj" style="top:254px">▲<br>ptr j</div></div></div>' +
    '<div class="am-log" id="am-log"></div>' +
    '<div class="am-brand"><div class="am-w" id="am-w" aria-hidden="true"></div><div class="am-tag">INTERACTIVE ALGORITHM LAB</div></div></div>' +
    '<button class="am-skip" id="am-skip" type="button">SKIP ›</button><div class="am-pct" id="am-pct">000%</div><div class="am-prog"><i id="am-fill"></i></div>';
  root.appendChild(el);

  var $ = function (id) { return d.getElementById(id); };
  var stage = $('am-stage'), fit = $('am-fit'), bar = $('am-bar'), sw = $('am-sw'), pi = $('am-pi'), pj = $('am-pj'),
      log = $('am-log'), fill = $('am-fill'), pct = $('am-pct');
  'Algo'.split('').concat('Mania'.split('')).forEach(function (c, i) {
    var s = d.createElement('span'); s.textContent = c; if (i > 3) s.className = 'm'; s.style.transitionDelay = (i * 45) + 'ms'; $('am-w').appendChild(s);
  });
  var cells = vals.map(function (v, i) {
    var c = d.createElement('div'); c.className = 'am-cell'; c.textContent = v; c.style.transform = 'translateX(' + X(i) + 'px)'; stage.appendChild(c); return c;
  });
  function fitStage() {
    /* scales the WHOLE composition to any screen: phone, tablet, laptop, 4K */
    var s = Math.max(.6, Math.min((innerWidth - 40) / 344, (innerHeight - 56) / 480, 2.4));
    el.style.setProperty('--s', s.toFixed(3)); stage.style.transform = 'scale(' + s + ')'; fit.style.width = 344 * s + 'px'; fit.style.height = 276 * s + 'px';
  }
  fitStage(); addEventListener('resize', fitStage);

  /* ---------- helpers ---------- */
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var ty, gone = false, tlDone = false;
  var loaded = d.readyState === 'complete' || d.readyState === 'interactive';
  var onReady = function () { loaded = true; };
  if (!loaded) {
    addEventListener('DOMContentLoaded', onReady, { once: true });
    addEventListener('load', onReady, { once: true });
  }

  function type(t) {
    clearInterval(ty); var n = 0; log.textContent = '';
    ty = setInterval(function () {
      log.textContent = t.slice(0, ++n);
      if (n >= t.length) clearInterval(ty);
    }, 15);
  }
  function put(p, i) { p.style.transform = 'translateX(' + X(i) + 'px)'; }
  function mv(c, a, b, dy, ms) {
    c.style.transform = 'translateX(' + b + 'px)';
    if (typeof c.animate === 'function') {
      try {
        var anim = c.animate(
          [{ transform: 'translateX(' + a + 'px)' }, { transform: 'translate(' + (a + b) / 2 + 'px,' + dy + 'px)' }, { transform: 'translateX(' + b + 'px)' }],
          { duration: ms, easing: 'cubic-bezier(.65,0,.35,1)' }
        );
        return anim.finished || sleep(ms);
      } catch (e) {
        return sleep(ms);
      }
    }
    return sleep(ms);
  }
  function swap(a, b) {
    var A = cells[a], B = cells[b]; cells[a] = B; cells[b] = A;
    sw.style.transform = 'translateX(' + ((a + b) / 2 * 50 - 2) + 'px)'; sw.classList.add('on');
    return Promise.all([mv(A, X(a), X(b), -14, 300), mv(B, X(b), X(a), 10, 300)]).then(function () { sw.classList.remove('on'); });
  }

  /* ---------- timeline: selection sort -> BST -> brand ---------- */
  async function run() {
    try {
      await sleep(150); if (gone) return; bar.classList.add('in');
      cells.forEach(function (c, i) { setTimeout(function () { if (!gone) c.classList.add('in'); }, i * 45); });
      type('> selection_sort(arr)   // O(n²)');
      await sleep(420); if (gone) return; pi.classList.add('on'); pj.classList.add('on');
      var cur = vals.slice(), i, j, m;
      for (i = 0; i < 3; i++) {
        if (gone) return;
        m = i; for (j = i + 1; j < 7; j++) if (cur[j] < cur[m]) m = j;
        var ci = cells[i], cm = cells[m];
        put(pi, i); put(pj, m); ci.classList.add('hi'); cm.classList.add('hj');
        await sleep(150); if (gone) return;
        if (m !== i) { await swap(i, m); var tmp = cur[i]; cur[i] = cur[m]; cur[m] = tmp; }
        ci.classList.remove('hi'); cm.classList.remove('hj'); cm.classList.add('ok');
        await sleep(40);
      }
      if (gone) return;
      pi.classList.remove('on'); pj.classList.remove('on');
      cells.slice(3).forEach(function (c, k) { setTimeout(function () { if (!gone) c.classList.add('ok'); }, k * 50); });
      type('> build_bst(sorted)   // mid → root');
      el.classList.add('tree'); await sleep(450); if (gone) return;
      el.classList.add('brand');
      await sleep(350); if (gone) return;
      type('> BST: BALANCED   TIME: O(n log n)  ✓');
      await sleep(520); tlDone = true;
    } catch (err) {
      console.warn('[AlgoMania Intro] Animation step fallback:', err);
      tlDone = true;
    }
  }

  /* ---------- progress + exit ---------- */
  var TOTAL = 3300;
  var rafId = null;
  function tick(now) {
    if (gone) return;
    var elapsed = now - t0;
    // Don't let slow external third-party scripts block completion once animation timeline finishes
    if (tlDone && elapsed >= (TOTAL + 200)) loaded = true;
    var p = Math.min(elapsed / TOTAL, 1) * (loaded ? 1 : .92);
    fill.style.transform = 'scaleX(' + p + ')'; pct.textContent = ('00' + Math.round(p * 100)).slice(-3) + '%';
    if (tlDone && loaded) return leave();
    rafId = requestAnimationFrame(tick);
  }

  function leave() {
    if (gone) return; gone = true;
    clearTimeout(safetyWatchdog);
    clearInterval(ty);
    if (rafId) cancelAnimationFrame(rafId);
    removeEventListener('resize', fitStage);
    removeEventListener('keydown', onKeyDown);

    fill.style.transform = 'scaleX(1)'; pct.textContent = '100%';
    el.classList.add('out');
    setTimeout(function () {
      el.classList.add('open');
      root.dispatchEvent(new CustomEvent('algomania:intro-start'));
    }, 320);

    setTimeout(function () {
      root.classList.remove('am-lock');
      if (el && el.parentNode) el.parentNode.removeChild(el);
      if (st && st.parentNode) st.parentNode.removeChild(st);
      root.dispatchEvent(new CustomEvent('algomania:intro-done'));
      try { sessionStorage.setItem('am-intro', '1'); } catch (e) {}
    }, 1250);
  }

  // Hard safety watchdog guarantees screen never gets trapped under any condition
  var safetyWatchdog = setTimeout(function () {
    if (!gone) {
      console.warn('[AlgoMania Intro] Safety watchdog triggered; unveiling content.');
      leave();
    }
  }, 6500);

  var onKeyDown = function (e) {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.preventDefault();
      leave();
    }
  };

  $('am-skip').addEventListener('click', leave);
  addEventListener('keydown', onKeyDown);

  if (reduce) {
    cells.forEach(function (c) { c.classList.add('in', 'ok'); });
    bar.classList.add('in'); el.classList.add('tree', 'brand');
    tlDone = true; TOTAL = 700;
  } else {
    run();
  }
  rafId = requestAnimationFrame(tick);
})();`;
