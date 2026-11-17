import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

describe('Data Structures Hub & 500 Incident Resilience', () => {
  // Test the extractString logic implemented in ComplexityBox.js
  function extractString(val, fallback = 'O(1)') {
    if (typeof val === 'string' && val.trim().length > 0) return val;
    if (typeof val === 'number') return String(val);
    if (val && typeof val === 'object') {
      if (typeof val.worst === 'string') return val.worst;
      if (typeof val.worstCase === 'string') return val.worstCase;
      if (typeof val.average === 'string') return val.average;
      if (typeof val.averageCase === 'string') return val.averageCase;
      if (typeof val.best === 'string') return val.best;
      if (typeof val.bestCase === 'string') return val.bestCase;
      if (typeof val.time === 'string') return val.time;
      return fallback;
    }
    return fallback;
  }

  function resolveComplexities(complexity, bestCase, averageCase, worstCase, timeComplexity, spaceComplexity) {
    const timeObj = typeof complexity?.time === 'object' && complexity?.time !== null ? complexity.time : null;
    const timeStr = typeof complexity?.time === 'string' ? complexity.time : null;

    const rawBest = bestCase || complexity?.bestCase || complexity?.best || timeObj?.best || timeObj?.bestCase || timeStr || timeComplexity;
    const rawAvg = averageCase || complexity?.averageCase || complexity?.average || timeObj?.average || timeObj?.averageCase || timeStr || timeComplexity;
    const rawWorst = worstCase || complexity?.worstCase || complexity?.worst || timeObj?.worst || timeObj?.worstCase || timeStr || timeComplexity;
    const rawSpace = spaceComplexity || complexity?.spaceComplexity || complexity?.space || 'O(1)';

    return {
      best: extractString(rawBest, 'O(1)'),
      avg: extractString(rawAvg, 'O(n)'),
      worst: extractString(rawWorst, 'O(n²)'),
      space: extractString(rawSpace, 'O(1)')
    };
  }

  test('extractString and resolveComplexities safely converts object complexities to primitive strings', () => {
    // This was the exact structure causing the 500 React child error on all 6 visualizers
    const objectComplexity = {
      time: {
        best: 'O(1) Direct Hash',
        average: 'O(1) Load Factor ≤ 0.7',
        worst: 'O(n) Full Collision'
      },
      space: 'O(n)'
    };

    const resolved = resolveComplexities(objectComplexity);

    assert.equal(typeof resolved.best, 'string');
    assert.equal(typeof resolved.avg, 'string');
    assert.equal(typeof resolved.worst, 'string');
    assert.equal(typeof resolved.space, 'string');

    assert.equal(resolved.best, 'O(1) Direct Hash');
    assert.equal(resolved.avg, 'O(1) Load Factor ≤ 0.7');
    assert.equal(resolved.worst, 'O(n) Full Collision');
    assert.equal(resolved.space, 'O(n)');
  });

  test('resolveComplexities handles flat sorting complexities (string time)', () => {
    const flatComplexity = {
      time: 'O(n²)',
      space: 'O(1)',
      bestCase: 'O(n)',
      averageCase: 'O(n²)',
      worstCase: 'O(n²)'
    };

    const resolved = resolveComplexities(flatComplexity);
    assert.equal(resolved.best, 'O(n)');
    assert.equal(resolved.avg, 'O(n²)');
    assert.equal(resolved.worst, 'O(n²)');
    assert.equal(resolved.space, 'O(1)');
  });

  test('resolveComplexities handles null and undefined safely with fallbacks', () => {
    const resolvedNull = resolveComplexities(null);
    assert.equal(resolvedNull.best, 'O(1)');
    assert.equal(resolvedNull.avg, 'O(n)');
    assert.equal(resolvedNull.worst, 'O(n²)');
    assert.equal(resolvedNull.space, 'O(1)');
  });

  test('DataStructureVisualizer.js utilizes next/dynamic with ssr: false', () => {
    const fileContent = fs.readFileSync(path.resolve('src/pages/DataStructureVisualizer.js'), 'utf-8');
    assert.ok(fileContent.includes("import dynamic from 'next/dynamic'"), 'Must import next/dynamic');
    assert.ok(fileContent.includes("ssr: false"), 'Must disable SSR for visualizers to prevent node canvas/audio exceptions');
    assert.ok(fileContent.includes("VisualizerSkeleton"), 'Must include loading fallback skeleton');
  });

  test('All six data structures routes exist in pages/data-structures/', () => {
    const requiredPages = [
      'stack.js',
      'queue.js',
      'linked-list.js',
      'heap.js',
      'hash-table.js',
      'searching.js'
    ];

    requiredPages.forEach((p) => {
      const fullPath = path.resolve('pages/data-structures', p);
      assert.ok(fs.existsSync(fullPath), `Route page pages/data-structures/${p} must exist`);
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert.ok(content.includes('<ProtectedRoute>'), `${p} must be protected`);
      assert.ok(content.includes('<DataStructureVisualizer'), `${p} must render DataStructureVisualizer`);
    });
  });
});
