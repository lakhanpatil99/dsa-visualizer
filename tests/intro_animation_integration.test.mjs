import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { ALGOMANIA_INTRO_SCRIPT } from '../src/components/intro/algoManiaIntroSource.js';

describe('AlgoMania Intro Animation Integration & Behavior Invariants', () => {
  const rootDir = process.cwd();

  it('exports valid, parseable JavaScript for ALGOMANIA_INTRO_SCRIPT', () => {
    assert.ok(typeof ALGOMANIA_INTRO_SCRIPT === 'string');
    assert.ok(ALGOMANIA_INTRO_SCRIPT.length > 500);

    // Verify it parses without syntax errors in Node V8 vm
    assert.doesNotThrow(() => {
      new vm.Script(ALGOMANIA_INTRO_SCRIPT);
    });
  });

  it('pages/_document.js embeds the intro gatekeeper script in <Head> before external scripts', () => {
    const docPath = path.join(rootDir, 'pages', '_document.js');
    const docContent = fs.readFileSync(docPath, 'utf8');

    assert.match(docContent, /import\s*\{\s*ALGOMANIA_INTRO_SCRIPT\s*\}\s*from\s*["'].*algoManiaIntroSource/);
    assert.match(docContent, /id=["']am-intro-gatekeeper["']/);
    assert.match(docContent, /__html:\s*ALGOMANIA_INTRO_SCRIPT/);

    // Ensure it is placed before external AdSense script so it runs synchronously before paint
    const gatekeeperIndex = docContent.indexOf('am-intro-gatekeeper');
    const adSenseIndex = docContent.indexOf('adsbygoogle');
    assert.ok(gatekeeperIndex !== -1, 'Gatekeeper script must be present');
    assert.ok(adSenseIndex !== -1, 'AdSense script must be present');
    assert.ok(gatekeeperIndex < adSenseIndex, 'Gatekeeper script must precede external scripts');
  });

  it('public/js/algomania-intro.js exists as a standalone static drop-in asset', () => {
    const staticScriptPath = path.join(rootDir, 'public', 'js', 'algomania-intro.js');
    assert.ok(fs.existsSync(staticScriptPath), 'public/js/algomania-intro.js must exist');
    const staticContent = fs.readFileSync(staticScriptPath, 'utf8');

    assert.match(staticContent, /oncePerSession:\s*true/);
    assert.match(staticContent, /am-lock/);
    assert.match(staticContent, /selection_sort/);
    assert.match(staticContent, /build_bst/);
  });

  it('enforces session-based display with graceful bypass for returning visitors', () => {
    assert.match(ALGOMANIA_INTRO_SCRIPT, /oncePerSession:\s*true/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /sessionStorage\.getItem\(['"]am-intro['"]\)/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /sessionStorage\.setItem\(['"]am-intro['"],\s*['"]1['"]\)/);
  });

  it('supports explicit testing override via ?intro=1 or ?replay=1 query parameters', () => {
    assert.match(ALGOMANIA_INTRO_SCRIPT, /intro=1/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /replay=1/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /!forceIntro\s*&&\s*CFG\.oncePerSession/);
  });

  it('preserves the exact original visual identity, palette, and SVG structures', () => {
    // Official palette variables
    assert.match(ALGOMANIA_INTRO_SCRIPT, /--o:#F05A28/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /--g:#1F4D3A/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /--k:#1d2a24/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /--c:#F7F4EC/);

    // Split panels
    assert.match(ALGOMANIA_INTRO_SCRIPT, /\.am-p\.t/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /\.am-p\.b/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /translateY\(-101%\)/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /translateY\(101%\)/);

    // Initial array values and nodes
    assert.match(ALGOMANIA_INTRO_SCRIPT, /62,\s*12,\s*88,\s*50,\s*25,\s*75,\s*37/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /viewBox="0 0 344 150"/);

    // Algorithm status and brand
    assert.match(ALGOMANIA_INTRO_SCRIPT, /STATE: SORTING/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /selection_sort/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /STATE: BUILDING/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /build_bst/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /STATE: READY/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /BST: BALANCED/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /INTERACTIVE ALGORITHM LAB/);
  });

  it('includes fail-safe mechanisms: hard safety watchdog and listener teardown', () => {
    // Hard watchdog prevents permanent screen lock
    assert.match(ALGOMANIA_INTRO_SCRIPT, /safetyWatchdog/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /6500/);

    // Clean teardown of listeners and timers
    assert.match(ALGOMANIA_INTRO_SCRIPT, /removeEventListener\(['"]resize['"],\s*fitStage\)/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /removeEventListener\(['"]keydown['"],\s*onKeyDown\)/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /cancelAnimationFrame\(rafId\)/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /clearTimeout\(safetyWatchdog\)/);
  });

  it('supports full keyboard accessibility, skip button, and reduced motion', () => {
    assert.match(ALGOMANIA_INTRO_SCRIPT, /e\.key === ['"]Escape['"]\s*\|\|\s*e\.key === ['"]Enter['"]/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /\$\(['"]am-skip['"]\)\.addEventListener\(['"]click['"],\s*leave\)/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /prefers-reduced-motion/);
  });

  it('locks background scrolling while active and unlocks upon completion', () => {
    assert.match(ALGOMANIA_INTRO_SCRIPT, /html\.am-lock,html\.am-lock body\{overflow:hidden!important\}/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /root\.classList\.add\(['"]am-lock['"]\)/);
    assert.match(ALGOMANIA_INTRO_SCRIPT, /root\.classList\.remove\(['"]am-lock['"]\)/);
  });
});
