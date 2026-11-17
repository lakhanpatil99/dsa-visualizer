/**
 * Universal AlgoMania Certificate Design System & Thematic Configurations.
 * Defines four distinct, institutional credential identities:
 *  - Bronze Competition Certificate (Burgundy & Antique Bronze)
 *  - Silver Competition Certificate (Slate Navy & Platinum Silver)
 *  - Gold Competition Certificate (Royal Emerald & Champagne Gold)
 *  - Internship Completion Certificate (Deep Teal & Corporate Champagne)
 * 
 * Framework-independent: Safe for both server-side PDF generation (pdf-lib)
 * and client-side browser rendering (React / SVG).
 */

export const CERTIFICATE_THEMES = {
  competition_bronze: {
    id: 'competition_bronze',
    name: 'Bronze Competition Certificate',
    categoryLabel: 'COMPETITION ACHIEVEMENT — BRONZE TIER',
    shortTier: 'BRONZE',
    colors: {
      primary: '#681F2A',     // Deep Burgundy
      secondary: '#A65E35',   // Antique Copper
      accent: '#C58B49',      // Bronze
      background: '#F8F0E3',  // Warm Ivory / Parchment
      innerBg: '#FFFDF9',     // Soft White Parchment
      textDark: '#402B27',    // Deep Brown
      textMuted: '#6E564F',   // Muted Earth Charcoal
      ribbonBg: '#681F2A',
      ribbonText: '#F8F0E3',
      ribbonBorder: '#C58B49',
      plaqueBg: '#F5EDE0',
      plaqueBorder: '#A65E35',
      sealOuter: '#A65E35',
      sealCore: '#681F2A',
      sealLaurel: '#C58B49',
      sealText: '#F8F0E3',
      sealSubtext: '#D8A770'
    },
    seal: {
      institution: 'ALGOMANIA',
      milestone: (count) => `${count || 20}+ SOLVED`,
      tierLabel: 'BRONZE ACHIEVEMENT',
      badgeText: 'OFFICIAL SEAL',
      symbol: 'bronze_stars'
    },
    narrative: {
      line1: 'for demonstrating foundational algorithmic excellence by successfully solving',
      line2: (milestone) => `${milestone || 20}+ unique algorithmic challenges verified on the AlgoMania Competition Platform.`
    }
  },

  competition_silver: {
    id: 'competition_silver',
    name: 'Silver Competition Certificate',
    categoryLabel: 'COMPETITION ACHIEVEMENT — SILVER TIER',
    shortTier: 'SILVER',
    colors: {
      primary: '#263746',     // Slate Navy
      secondary: '#89949F',   // Platinum
      accent: '#C5CCD2',      // Silver Metallic
      background: '#F5F6F5',  // Cool White / Light Parchment
      innerBg: '#FFFFFF',     // Pure Clean White
      textDark: '#37434D',    // Charcoal
      textMuted: '#5A6773',   // Muted Slate
      ribbonBg: '#263746',
      ribbonText: '#F5F6F5',
      ribbonBorder: '#C5CCD2',
      plaqueBg: '#EDF1F3',
      plaqueBorder: '#89949F',
      sealOuter: '#89949F',
      sealCore: '#263746',
      sealLaurel: '#C5CCD2',
      sealText: '#FFFFFF',
      sealSubtext: '#B0BAC3'
    },
    seal: {
      institution: 'ALGOMANIA',
      milestone: (count) => `${count || 100}+ SOLVED`,
      tierLabel: 'SILVER ACHIEVEMENT',
      badgeText: 'OFFICIAL SEAL',
      symbol: 'silver_shield'
    },
    narrative: {
      line1: 'for distinguished computational problem-solving and algorithmic proficiency across',
      line2: (milestone) => `${milestone || 100}+ unique algorithmic challenges verified on the AlgoMania Competition Platform.`
    }
  },

  competition_gold: {
    id: 'competition_gold',
    name: 'Gold Competition Certificate',
    categoryLabel: 'COMPETITION MASTERY — GOLD TIER',
    shortTier: 'GOLD',
    colors: {
      primary: '#173D32',     // Royal Emerald
      secondary: '#B88632',   // Antique Gold
      accent: '#D8AE55',      // Champagne Gold
      background: '#FBF5E8',  // Champagne Ivory
      innerBg: '#FFFDF8',     // Soft Luminous Cream
      textDark: '#302B20',    // Dark Forest Charcoal
      textMuted: '#5C523D',   // Muted Olive Gold
      ribbonBg: '#173D32',
      ribbonText: '#FBF5E8',
      ribbonBorder: '#D8AE55',
      plaqueBg: '#F5EDDA',
      plaqueBorder: '#B88632',
      sealOuter: '#B88632',
      sealCore: '#173D32',
      sealLaurel: '#D8AE55',
      sealText: '#FFFDF8',
      sealSubtext: '#E6C678'
    },
    seal: {
      institution: 'ALGOMANIA',
      milestone: (count) => `${count || 200}+ SOLVED`,
      tierLabel: 'GOLD ACHIEVEMENT',
      badgeText: 'OFFICIAL SEAL',
      symbol: 'gold_crown'
    },
    narrative: {
      line1: 'for exemplary computational mastery, exceptional data structure acumen, and solving',
      line2: (milestone) => `${milestone || 200}+ unique algorithmic challenges verified on the AlgoMania Competition Platform.`
    }
  },

  internship: {
    id: 'internship',
    name: 'Internship Completion Certificate',
    categoryLabel: 'CERTIFICATE OF INTERNSHIP COMPLETION',
    shortTier: 'FELLOWSHIP',
    colors: {
      primary: '#164A50',     // Deep Teal
      secondary: '#286C78',   // Corporate Blue
      accent: '#B5A16D',      // Champagne
      background: '#F5F7F4',  // Executive Off-White
      innerBg: '#FFFFFF',     // Crisp White
      textDark: '#263638',    // Deep Charcoal
      textMuted: '#4E6163',   // Muted Corporate Slate
      ribbonBg: '#164A50',
      ribbonText: '#F5F7F4',
      ribbonBorder: '#B5A16D',
      plaqueBg: '#EBF0EE',
      plaqueBorder: '#286C78',
      sealOuter: '#286C78',
      sealCore: '#164A50',
      sealLaurel: '#B5A16D',
      sealText: '#FFFFFF',
      sealSubtext: '#D2C39B'
    },
    seal: {
      institution: 'ALGOMANIA',
      milestone: () => 'INTERNSHIP COMPLETED',
      tierLabel: 'ENGINEERING FELLOWSHIP',
      badgeText: 'OFFICIAL SEAL',
      symbol: 'internship_cap'
    },
    narrative: {
      line1: (duration) => `for successfully completing the rigorous ${duration || '2 Months'} curriculum in`,
      line2: (domain) => `${domain || 'Software Engineering'} Track with verified algorithmic implementation and mentor defense.`
    }
  }
};

/**
 * Retrieve the theme configuration for a given certificate type.
 * Defaults to internship if unrecognized.
 */
export function getCertificateTheme(type) {
  if (!type) return CERTIFICATE_THEMES.internship;
  const normalized = String(type).trim().toLowerCase();
  if (normalized.includes('gold')) return CERTIFICATE_THEMES.competition_gold;
  if (normalized.includes('silver')) return CERTIFICATE_THEMES.competition_silver;
  if (normalized.includes('bronze')) return CERTIFICATE_THEMES.competition_bronze;
  if (normalized.includes('intern')) return CERTIFICATE_THEMES.internship;
  return CERTIFICATE_THEMES[normalized] || CERTIFICATE_THEMES.internship;
}

/**
 * Convert a hexadecimal color string to a 0-1 RGB triplet.
 * Useful for pdf-lib rgb() calls without pulling pdf-lib into browser bundles.
 */
export function hexToRgbValues(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255
  };
}
