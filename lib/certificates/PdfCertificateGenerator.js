import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { getCertificateTheme, hexToRgbValues } from './certificateThemes.js';
import { CERTIFICATE_LAYOUT } from './certificateLayout.js';
import {
  LAUREL_LEFT_PATH,
  LAUREL_RIGHT_PATH,
  STAR_EMBLEM_PATH,
  SHIELD_EMBLEM_PATH,
  CROWN_EMBLEM_PATH,
  GRAD_CAP_PATH
} from './certificateMedallions.js';

function toPdfRgb(hex) {
  const { r, g, b } = hexToRgbValues(hex);
  return rgb(r, g, b);
}

// In-memory buffer cache for static brand assets (avoids repeated synchronous disk reads on each generation)
let cachedStaticAssets = null;

function getStaticAssets() {
  if (cachedStaticAssets) return cachedStaticAssets;
  const publicDir = path.join(process.cwd(), 'public');
  let iconBytes = null;
  let logoBytes = null;
  let sigBytes = null;

  try {
    const iconPath = path.join(publicDir, 'apple-touch-icon.png');
    if (fs.existsSync(iconPath)) iconBytes = fs.readFileSync(iconPath);
  } catch (e) {
    console.warn('Icon asset load failed:', e.message);
  }

  try {
    const logoPath = path.join(publicDir, 'AlgoMania Interactive Algorithm Lab Logo.png');
    if (fs.existsSync(logoPath)) logoBytes = fs.readFileSync(logoPath);
  } catch (e) {
    console.warn('Logo asset load failed:', e.message);
  }

  try {
    const sigPath = path.join(publicDir, 'LakhansingSignature.png');
    if (fs.existsSync(sigPath)) sigBytes = fs.readFileSync(sigPath);
  } catch (e) {
    console.warn('Signature asset load failed:', e.message);
  }

  cachedStaticAssets = { iconBytes, logoBytes, sigBytes };
  return cachedStaticAssets;
}

/**
 * Universal AlgoMania Institutional PDF Certificate Generator.
 * Implements the canonical layout specification defined in CERTIFICATE_LAYOUT.
 * - Perfectly balanced vertical distribution (zero dead space)
 * - Exact vector laurel positioning (fully contained within the medallion core)
 * - Safe dedicated footer zone with zero overlap
 * - Clean three-column footer without unwanted vertical separator lines
 * - In-memory asset caching and direct buffer processing for fast generation
 */
export async function generateCertificatePdf(certData) {
  const {
    certificateId = 'ALG-SAMPLE-0000',
    recipientName = 'Honored Scholar',
    type = 'internship',
    title = 'Software Engineering Program',
    domain = 'Software Engineering',
    tier = null,
    milestoneCount = null,
    duration = '2 Months',
    startDate = null,
    endDate = null,
    issueDate = new Date(),
    verificationUrl = `https://www.algomania.in/certificates/verify/${certificateId}`
  } = certData;

  const themeConfig = getCertificateTheme(type);
  const layout = CERTIFICATE_LAYOUT;

  const colors = {
    primary: toPdfRgb(themeConfig.colors.primary),
    secondary: toPdfRgb(themeConfig.colors.secondary),
    accent: toPdfRgb(themeConfig.colors.accent),
    background: toPdfRgb(themeConfig.colors.background),
    innerBg: toPdfRgb(themeConfig.colors.innerBg),
    textDark: toPdfRgb(themeConfig.colors.textDark),
    textMuted: toPdfRgb(themeConfig.colors.textMuted),
    ribbonBg: toPdfRgb(themeConfig.colors.ribbonBg),
    ribbonText: toPdfRgb(themeConfig.colors.ribbonText),
    ribbonBorder: toPdfRgb(themeConfig.colors.ribbonBorder),
    plaqueBg: toPdfRgb(themeConfig.colors.plaqueBg),
    plaqueBorder: toPdfRgb(themeConfig.colors.plaqueBorder),
    sealOuter: toPdfRgb(themeConfig.colors.sealOuter),
    sealCore: toPdfRgb(themeConfig.colors.sealCore),
    sealLaurel: toPdfRgb(themeConfig.colors.sealLaurel),
    sealText: toPdfRgb(themeConfig.colors.sealText),
    sealSubtext: toPdfRgb(themeConfig.colors.sealSubtext)
  };

  // Exact A4 Landscape dimensions (points)
  const width = layout.canvas.width;
  const height = layout.canvas.height;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([width, height]);

  // Load standard fonts
  const fontSerifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontSerifItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const fontSerif = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSans = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // 1. Warm Parchment Background Fill
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: colors.background
  });

  // 2. Outer Ornamental Border
  const margin = layout.margins.outer;
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - margin * 2,
    height: height - margin * 2,
    color: colors.innerBg,
    borderColor: colors.primary,
    borderWidth: 1.75
  });

  // 3. Inner Delicate Decorative Border with Indented Corners
  const innerMargin = layout.margins.inner;
  page.drawRectangle({
    x: innerMargin,
    y: innerMargin,
    width: width - innerMargin * 2,
    height: height - innerMargin * 2,
    borderColor: colors.secondary,
    borderWidth: 0.75
  });

  // Corner Bracket & Accent Details (Institutional framing)
  const cornerIndent = layout.margins.cornerIndent;
  const corners = [
    { x: innerMargin, y: height - innerMargin, dx: 1, dy: -1 },
    { x: width - innerMargin, y: height - innerMargin, dx: -1, dy: -1 },
    { x: innerMargin, y: innerMargin, dx: 1, dy: 1 },
    { x: width - innerMargin, y: innerMargin, dx: -1, dy: 1 }
  ];

  for (const c of corners) {
    page.drawLine({
      start: { x: c.x, y: c.y + c.dy * cornerIndent },
      end: { x: c.x + c.dx * cornerIndent, y: c.y + c.dy * cornerIndent },
      thickness: 0.75,
      color: colors.accent
    });
    page.drawLine({
      start: { x: c.x + c.dx * cornerIndent, y: c.y },
      end: { x: c.x + c.dx * cornerIndent, y: c.y + c.dy * cornerIndent },
      thickness: 0.75,
      color: colors.accent
    });
    page.drawLine({
      start: { x: c.x + c.dx * 2, y: c.y + c.dy * 10 },
      end: { x: c.x + c.dx * 10, y: c.y + c.dy * 2 },
      thickness: 0.75,
      color: colors.secondary
    });
  }

  // 4. Embed Brand Assets from in-memory cache
  const { iconBytes, logoBytes, sigBytes } = getStaticAssets();

  // Upper Left Emblem (apple-touch-icon.png)
  if (iconBytes) {
    try {
      const iconImg = await pdfDoc.embedPng(iconBytes);
      page.drawImage(iconImg, {
        x: layout.header.emblem.x,
        y: layout.header.emblem.y,
        width: layout.header.emblem.size,
        height: layout.header.emblem.size
      });
    } catch (e) {
      console.warn('Emblem embed failed:', e.message);
    }
  }

  // Main AlgoMania Wordmark Logo (centered near top)
  if (logoBytes) {
    try {
      const logoImg = await pdfDoc.embedPng(logoBytes);
      const logoWidth = layout.header.logo.width;
      const logoHeight = (logoWidth / logoImg.width) * logoImg.height;
      page.drawImage(logoImg, {
        x: (width - logoWidth) / 2,
        y: layout.header.logo.y,
        width: logoWidth,
        height: logoHeight
      });
    } catch (e) {
      console.warn('Logo embed failed:', e.message);
    }
  }

  // 5. Shaped Category Ribbon / Cartouche
  const categoryText = themeConfig.categoryLabel;
  const ribbonCenterY = layout.ribbon.centerY;
  const ribbonTextWidth = fontSansBold.widthOfTextAtSize(categoryText, layout.ribbon.fontSize);
  const ribbonWidth = Math.max(layout.ribbon.minWidth, ribbonTextWidth + 48);
  const ribbonHeight = layout.ribbon.height;
  const ribbonLeft = (width - ribbonWidth) / 2;
  const ribbonRight = (width + ribbonWidth) / 2;
  const ribbonBottom = ribbonCenterY - ribbonHeight / 2;

  // Draw main ribbon body with swallowtail framing
  page.drawRectangle({
    x: ribbonLeft,
    y: ribbonBottom,
    width: ribbonWidth,
    height: ribbonHeight,
    color: colors.ribbonBg,
    borderColor: colors.ribbonBorder,
    borderWidth: 1.25
  });

  // Inner ribbon highlight frame
  page.drawRectangle({
    x: ribbonLeft + 2,
    y: ribbonBottom + 2,
    width: ribbonWidth - 4,
    height: ribbonHeight - 4,
    borderColor: colors.secondary,
    borderWidth: 0.5
  });

  // Left & right ornamental horizontal flourish extensions
  const flourishLen = layout.ribbon.flourishLength;
  page.drawLine({
    start: { x: ribbonLeft - flourishLen, y: ribbonCenterY },
    end: { x: ribbonLeft - 4, y: ribbonCenterY },
    thickness: 1,
    color: colors.secondary
  });
  page.drawCircle({
    x: ribbonLeft - flourishLen,
    y: ribbonCenterY,
    size: 2,
    color: colors.accent
  });

  page.drawLine({
    start: { x: ribbonRight + 4, y: ribbonCenterY },
    end: { x: ribbonRight + flourishLen, y: ribbonCenterY },
    thickness: 1,
    color: colors.secondary
  });
  page.drawCircle({
    x: ribbonRight + flourishLen,
    y: ribbonCenterY,
    size: 2,
    color: colors.accent
  });

  // Category Ribbon Text
  page.drawText(categoryText, {
    x: (width - ribbonTextWidth) / 2,
    y: ribbonCenterY - 3.5,
    size: layout.ribbon.fontSize,
    font: fontSansBold,
    color: colors.ribbonText
  });

  // 6. "PROUDLY PRESENTED TO"
  const certifyText = 'P R O U D L Y   P R E S E N T E D   T O';
  const certifyWidth = fontSans.widthOfTextAtSize(certifyText, layout.certifyNotice.fontSize);
  page.drawText(certifyText, {
    x: (width - certifyWidth) / 2,
    y: layout.certifyNotice.y,
    size: layout.certifyNotice.fontSize,
    font: fontSans,
    color: colors.textMuted
  });

  // 7. Recipient Name (Prominent Serif with boundary scaling)
  let nameSize = layout.recipient.baseFontSize;
  let nameWidth = fontSerifBold.widthOfTextAtSize(recipientName, nameSize);
  const maxNameWidth = layout.recipient.maxWidth;
  if (nameWidth > maxNameWidth) {
    nameSize = Math.floor(nameSize * (maxNameWidth / nameWidth));
    nameWidth = fontSerifBold.widthOfTextAtSize(recipientName, nameSize);
  }
  page.drawText(recipientName, {
    x: (width - nameWidth) / 2,
    y: layout.recipient.y,
    size: nameSize,
    font: fontSerifBold,
    color: colors.primary
  });

  // 8. Narrative Description
  let line1 = '';
  let line2 = '';

  if (themeConfig.id === 'internship') {
    line1 = themeConfig.narrative.line1(duration);
    line2 = themeConfig.narrative.line2(domain);
  } else {
    line1 = themeConfig.narrative.line1;
    line2 = themeConfig.narrative.line2(milestoneCount);
  }

  let l1Size = layout.narrative.fontSize;
  let l1Width = fontSerifItalic.widthOfTextAtSize(line1, l1Size);
  if (l1Width > layout.narrative.maxWidth) {
    l1Size = Math.floor(l1Size * (layout.narrative.maxWidth / l1Width) * 10) / 10;
    l1Width = fontSerifItalic.widthOfTextAtSize(line1, l1Size);
  }
  page.drawText(line1, {
    x: (width - l1Width) / 2,
    y: layout.narrative.line1Y,
    size: l1Size,
    font: fontSerifItalic,
    color: colors.textMuted
  });

  let l2Size = layout.narrative.fontSize;
  let l2Width = fontSerifBold.widthOfTextAtSize(line2, l2Size);
  if (l2Width > layout.narrative.maxWidth) {
    l2Size = Math.floor(l2Size * (layout.narrative.maxWidth / l2Width) * 10) / 10;
    l2Width = fontSerifBold.widthOfTextAtSize(line2, l2Size);
  }
  page.drawText(line2, {
    x: (width - l2Width) / 2,
    y: layout.narrative.line2Y,
    size: l2Size,
    font: fontSerifBold,
    color: colors.textDark
  });

  // 9. Credential Information Plaque Box
  const boxWidth = 520; // CERTIFICATE_LAYOUT.plaque.boxWidth
  const boxHeight = layout.plaque.boxHeight;
  const boxX = (width - boxWidth) / 2;
  const boxY = layout.plaque.boxY;

  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: colors.plaqueBg,
    borderColor: colors.plaqueBorder,
    borderWidth: 1
  });

  const formattedDate = new Date(issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dateSub = `Issued on: ${formattedDate}   •   Credential ID: ${certificateId}`;
  let dSize = layout.plaque.fontSize;
  let dWidth = fontSans.widthOfTextAtSize(dateSub, dSize);
  if (dWidth > boxWidth - 28) {
    dSize = Math.floor(dSize * ((boxWidth - 28) / dWidth) * 10) / 10;
    dWidth = fontSans.widthOfTextAtSize(dateSub, dSize);
  }
  page.drawText(dateSub, {
    x: (width - dWidth) / 2,
    y: boxY + 12,
    size: dSize,
    font: fontSans,
    color: colors.textDark
  });

  // --- 10. BOTTOM THREE-COLUMN FOOTER SECTION (Clean Triad Without Unwanted Vertical Lines) ---
  const bottom = layout.bottomRow;

  // A. Left Column: Scannable QR Code
  const qrX = bottom.qr.x;
  const qrY = bottom.qr.y;
  const qrSize = bottom.qr.size;

  try {
    const qrBuffer = await QRCode.toBuffer(verificationUrl, {
      type: 'png',
      margin: 1,
      width: 140,
      color: { dark: themeConfig.colors.textDark, light: themeConfig.colors.innerBg }
    });
    const qrImg = await pdfDoc.embedPng(qrBuffer);

    page.drawImage(qrImg, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize
    });

    page.drawText('Scan to Verify', {
      x: qrX,
      y: bottom.qr.scanTextY,
      size: 8,
      font: fontSansBold,
      color: colors.primary
    });

    page.drawText('Official Credential', {
      x: qrX,
      y: bottom.qr.subTextY,
      size: 6.5,
      font: fontSans,
      color: colors.textMuted
    });
  } catch (qrErr) {
    console.error('Error embedding QR code into PDF:', qrErr);
  }

  // B. Center Column: Distinct Official Medallion
  const sealCenterX = bottom.seal.centerX;
  const sealCenterY = bottom.seal.centerY;
  const sealOuterR = bottom.seal.outerRadius;

  // Outer Scalloped / Milled / Beveled Rim per Theme
  if (themeConfig.id === 'competition_gold') {
    const numPoints = 32;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      const px = sealCenterX + Math.cos(angle) * (sealOuterR + 1.5);
      const py = sealCenterY + Math.sin(angle) * (sealOuterR + 1.5);
      page.drawCircle({
        x: px,
        y: py,
        size: 3,
        color: colors.accent
      });
    }
  } else if (themeConfig.id === 'competition_bronze') {
    const numBeads = 24;
    for (let i = 0; i < numBeads; i++) {
      const angle = (i * 2 * Math.PI) / numBeads;
      const px = sealCenterX + Math.cos(angle) * (sealOuterR + 1);
      const py = sealCenterY + Math.sin(angle) * (sealOuterR + 1);
      page.drawCircle({
        x: px,
        y: py,
        size: 2.5,
        color: colors.secondary
      });
    }
  } else if (themeConfig.id === 'competition_silver') {
    const numTicks = 16;
    for (let i = 0; i < numTicks; i++) {
      const angle = (i * 2 * Math.PI) / numTicks;
      page.drawLine({
        start: {
          x: sealCenterX + Math.cos(angle) * (sealOuterR - 2),
          y: sealCenterY + Math.sin(angle) * (sealOuterR - 2)
        },
        end: {
          x: sealCenterX + Math.cos(angle) * (sealOuterR + 2),
          y: sealCenterY + Math.sin(angle) * (sealOuterR + 2)
        },
        thickness: 0.75,
        color: colors.accent
      });
    }
  } else {
    // Internship: Technical bezel with 8 compass pips
    const numPips = 8;
    for (let i = 0; i < numPips; i++) {
      const angle = (i * 2 * Math.PI) / numPips;
      page.drawCircle({
        x: sealCenterX + Math.cos(angle) * (sealOuterR + 1),
        y: sealCenterY + Math.sin(angle) * (sealOuterR + 1),
        size: 2,
        color: colors.secondary
      });
    }
  }

  // Outer primary ring
  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: sealOuterR,
    color: colors.sealOuter,
    borderColor: colors.accent,
    borderWidth: 1.5
  });

  // Concentric metallic relief ring
  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: sealOuterR - 4,
    borderColor: colors.accent,
    borderWidth: 0.75
  });

  // Solid Core Circle in Theme Color
  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: bottom.seal.coreRadius,
    color: colors.sealCore,
    borderColor: colors.accent,
    borderWidth: 1
  });

  // Draw Laurel Wreath Branches & Emblem with exact SVG Y-inversion compensation
  try {
    const laurelScale = bottom.seal.laurelScale;
    const laurelX = sealCenterX - 50 * laurelScale;
    const laurelY = sealCenterY + 50 * laurelScale;

    page.drawSvgPath(LAUREL_LEFT_PATH, {
      x: laurelX,
      y: laurelY,
      scale: laurelScale,
      color: colors.sealLaurel
    });

    page.drawSvgPath(LAUREL_RIGHT_PATH, {
      x: laurelX,
      y: laurelY,
      scale: laurelScale,
      color: colors.sealLaurel
    });

    let emblemPath = STAR_EMBLEM_PATH;
    if (themeConfig.id === 'competition_silver') emblemPath = SHIELD_EMBLEM_PATH;
    else if (themeConfig.id === 'competition_gold') emblemPath = CROWN_EMBLEM_PATH;
    else if (themeConfig.id === 'internship') emblemPath = GRAD_CAP_PATH;

    page.drawSvgPath(emblemPath, {
      x: laurelX,
      y: laurelY,
      scale: laurelScale,
      color: colors.sealLaurel
    });
  } catch (svgErr) {
    console.warn('Vector laurel rendering note:', svgErr.message);
  }

  // Medallion Typography
  const sealTitle = themeConfig.seal.institution;
  const stWidth = fontSansBold.widthOfTextAtSize(sealTitle, 6.5);
  page.drawText(sealTitle, {
    x: sealCenterX - stWidth / 2,
    y: sealCenterY + 16,
    size: 6.5,
    font: fontSansBold,
    color: colors.sealText
  });

  const milestoneText = typeof themeConfig.seal.milestone === 'function'
    ? themeConfig.seal.milestone(milestoneCount)
    : themeConfig.seal.milestone;
  const mSize = themeConfig.id === 'internship' ? 7.5 : 9;
  const mWidth = fontSansBold.widthOfTextAtSize(milestoneText, mSize);
  page.drawText(milestoneText, {
    x: sealCenterX - mWidth / 2,
    y: sealCenterY + 3,
    size: mSize,
    font: fontSansBold,
    color: colors.sealText
  });

  const tierSub = themeConfig.seal.tierLabel;
  const tsWidth = fontSansBold.widthOfTextAtSize(tierSub, 5.5);
  page.drawText(tierSub, {
    x: sealCenterX - tsWidth / 2,
    y: sealCenterY - 8,
    size: 5.5,
    font: fontSansBold,
    color: colors.sealSubtext
  });

  const sealFoot = themeConfig.seal.badgeText;
  const sfWidth = fontSans.widthOfTextAtSize(sealFoot, 5);
  page.drawText(sealFoot, {
    x: sealCenterX - sfWidth / 2,
    y: sealCenterY - 18,
    size: 5,
    font: fontSans,
    color: colors.sealSubtext
  });

  // C. Right Column: Founder Signature & Authorization Area (Clean baseline, no vertical intersection)
  const sigX = bottom.signature.x;
  const sigY = bottom.signature.y;
  const sigWidth = bottom.signature.width;

  if (sigBytes) {
    try {
      const sigImg = await pdfDoc.embedPng(sigBytes);
      const sigHeight = (sigWidth / sigImg.width) * sigImg.height;

      page.drawImage(sigImg, {
        x: sigX + (bottom.signature.lineWidth - sigWidth) / 2,
        y: sigY + 6,
        width: sigWidth,
        height: sigHeight
      });
    } catch (e) {
      console.warn('Signature embed failed:', e.message);
    }
  }

  // Signature rule line (clean deliberate horizontal line)
  page.drawLine({
    start: { x: sigX, y: bottom.signature.lineY },
    end: { x: sigX + bottom.signature.lineWidth, y: bottom.signature.lineY },
    thickness: 1,
    color: colors.primary
  });

  // Founder Name & Title
  const signeeName = 'Lakhansing Patil';
  const snWidth = fontSansBold.widthOfTextAtSize(signeeName, 10);
  page.drawText(signeeName, {
    x: sigX + (bottom.signature.lineWidth - snWidth) / 2,
    y: bottom.signature.nameY,
    size: 10,
    font: fontSansBold,
    color: colors.textDark
  });

  const signeeTitle = 'Founder, AlgoMania';
  const stitleWidth = fontSans.widthOfTextAtSize(signeeTitle, 8.5);
  page.drawText(signeeTitle, {
    x: sigX + (bottom.signature.lineWidth - stitleWidth) / 2,
    y: bottom.signature.titleY,
    size: 8.5,
    font: fontSans,
    color: colors.primary
  });

  // 11. Verification URL Footnote (Safe dedicated zone at y=44)
  const footnote = `Official validation record securely hosted at: ${verificationUrl}`;
  let fnSize = layout.footer.fontSize;
  let fnWidth = fontSans.widthOfTextAtSize(footnote, fnSize);
  if (fnWidth > width - 100) {
    fnSize = Math.floor(fnSize * ((width - 100) / fnWidth) * 10) / 10;
    fnWidth = fontSans.widthOfTextAtSize(footnote, fnSize);
  }
  page.drawText(footnote, {
    x: (width - fnWidth) / 2,
    y: 44, // CERTIFICATE_LAYOUT.footer.y (Safe dedicated zone at y=44)
    size: fnSize,
    font: fontSans,
    color: colors.textMuted
  });

  return await pdfDoc.save();
}
