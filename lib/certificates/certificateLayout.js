/**
 * Universal AlgoMania Certificate Canonical Layout Specification.
 * Single source of truth for coordinates, dimensions, and typography scaling.
 * Shared between:
 *  - lib/certificates/PdfCertificateGenerator.js (Official PDF Document)
 *  - src/components/certificates/CertificatePreviewModal.js (Browser Preview Modal)
 *  - scripts/generate_sample_certificates.mjs
 *  - scripts/generate_html_previews.mjs
 */

export const CERTIFICATE_LAYOUT = {
  // A4 Landscape Dimensions (points)
  canvas: {
    width: 841.89,
    height: 595.28,
    aspectRatio: 841.89 / 595.28 // 1.4142
  },

  // Borders & Framing
  margins: {
    outer: 20,
    inner: 28,
    cornerIndent: 12
  },

  // Top Header Area
  header: {
    emblem: {
      x: 48,
      y: 520, // PDF Y coordinate
      size: 44
    },
    logo: {
      width: 195,
      y: 516 // PDF Y coordinate
    }
  },

  // Category Ribbon Cartouche
  ribbon: {
    centerY: 462,
    height: 28,
    minWidth: 380,
    flourishLength: 42,
    fontSize: 10.5
  },

  // "PROUDLY PRESENTED TO"
  certifyNotice: {
    y: 422,
    fontSize: 8.5
  },

  // Recipient Name
  recipient: {
    y: 376,
    baseFontSize: 34,
    maxWidth: 680
  },

  // Narrative Description (Two Lines)
  narrative: {
    line1Y: 334,
    line2Y: 314,
    fontSize: 12.5,
    maxWidth: 700
  },

  // Credential Plaque Container
  plaque: {
    boxY: 250, // Bottom of box in PDF Y
    boxHeight: 34,
    boxWidth: 520,
    fontSize: 8.5
  },

  // Bottom Triad (QR Code, Medallion, Signature)
  bottomRow: {
    // Center Medallion
    seal: {
      centerX: 420.94, // width / 2
      centerY: 140,    // Perfectly centered between plaque (250) and footer (44)
      outerRadius: 44,
      coreRadius: 36,
      laurelScale: 0.72
    },
    // Left: QR Code
    qr: {
      x: 68,
      y: 108,
      size: 64,
      scanTextY: 96,
      subTextY: 86
    },
    // Right: Founder Signature & Title
    signature: {
      x: 640,
      y: 124,
      width: 110,
      lineWidth: 136,
      lineY: 132,
      nameY: 118,
      titleY: 106
    },
    // Vertical hairline dividers
    dividers: {
      leftX: 172,
      rightX: 668,
      yTop: 180,
      yBottom: 98
    }
  },

  // Bottom Verification Footnote
  footer: {
    y: 44,
    fontSize: 7.5,
    safeClearance: 16 // Points above inner bottom border (28)
  }
};
