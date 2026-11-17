/**
 * Universal Medallion Vector Definitions for AlgoMania Certificates.
 * Provides vector paths and SVG component structures for:
 *  1. Bronze Medallion (Burgundy core, bronze rim, laurels, bronze star motif)
 *  2. Silver Medallion (Slate-navy core, platinum milled rim, silver laurels, shield crest)
 *  3. Gold Medallion (Emerald core, 32-point sunburst outer rim, elaborate gold laurels, crown/star)
 *  4. Internship Medallion (Teal core, corporate metallic rim, completion laurels, graduation cap)
 */

// Classical Laurel Wreath Paths (Centered on a 100x100 viewBox with core radius ~34)
// Left laurel branch: curves from bottom-left (50, 84) up along left rim to (30, 24)
export const LAUREL_LEFT_PATH = 
  'M 42 82 C 34 78 26 68 24 54 C 22 42 26 32 34 22 ' +
  'C 32 26 31 32 33 36 C 27 34 22 38 23 44 C 29 43 32 46 32 50 ' +
  'C 25 50 22 56 24 62 C 30 61 33 64 34 68 C 29 70 28 77 34 80 Z';

// Right laurel branch: mirrored along x=50
export const LAUREL_RIGHT_PATH = 
  'M 58 82 C 66 78 74 68 76 54 C 78 42 74 32 66 22 ' +
  'C 68 26 69 32 67 36 C 73 34 78 38 77 44 C 71 43 68 46 68 50 ' +
  'C 75 50 78 56 76 62 C 70 61 67 64 66 68 C 71 70 72 77 66 80 Z';

// 5-Point Star Emblem (Centered at x=50, y=28, width ~12)
export const STAR_EMBLEM_PATH = 
  'M 50 22 L 52.4 27 L 57.8 27.6 L 53.8 31.2 L 54.8 36.6 L 50 33.9 L 45.2 36.6 L 46.2 31.2 L 42.2 27.6 L 47.6 27 Z';

// Silver Shield Crest (Centered at x=50, y=28)
export const SHIELD_EMBLEM_PATH = 
  'M 50 21 L 56 23 L 56 30 C 56 35 53 38 50 40 C 47 38 44 35 44 30 L 44 23 Z';

// Gold Crown / Grand Crest (Centered at x=50, y=28)
export const CROWN_EMBLEM_PATH = 
  'M 42 35 L 43 25 L 47 29 L 50 23 L 53 29 L 57 25 L 58 35 Z';

// Graduation Cap Emblem (Centered at x=50, y=28)
export const GRAD_CAP_PATH = 
  'M 50 22 L 62 27 L 50 32 L 38 27 Z M 43 31.5 L 43 36 C 45 38 55 38 57 36 L 57 31.5 Z M 60 28 L 62 35 L 61 35.5 L 59 28.5 Z';

// Category Banner Swallowtail Ribbon Path (Width: 380, Height: 26, Centered)
export function getRibbonPath(width = 380, height = 26) {
  const w2 = width / 2;
  const h2 = height / 2;
  const notch = 12; // Swallowtail notch depth
  return `M ${-w2} ${-h2} L ${w2} ${-h2} L ${w2 - notch} 0 L ${w2} ${h2} L ${-w2} ${h2} L ${-w2 + notch} 0 Z`;
}

// Generate Sunburst / Scalloped Outer Rim Points for vector polygon
export function generateSunburstPoints(cx, cy, outerR, innerR, points = 32) {
  const pathParts = [];
  const step = (Math.PI * 2) / (points * 2);
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = (cx + r * Math.cos(angle)).toFixed(2);
    const y = (cy + r * Math.sin(angle)).toFixed(2);
    pathParts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  pathParts.push('Z');
  return pathParts.join(' ');
}
