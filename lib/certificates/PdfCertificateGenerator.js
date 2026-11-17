import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { getCertificateTheme, hexToRgbValues } from './certificateThemes.js';
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

/**
 * Universal AlgoMania Institutional PDF Certificate Generator.
 * Faithfully produces the prestigious, institutional certificate aesthetic:
 * - Double ornamental outer border with refined corner brackets & accents
 * - Upper-left brand emblem and centered main AlgoMania wordmark
 * - Shaped swallowtail category ribbon / cartouche with horizontal flourish extensions
 * - "PROUDLY PRESENTED TO" in spaced uppercase
 * - Recipient name in prominent serif with auto-scaling to prevent overflow
 * - Narrative description with italic and bold milestone highlights
 * - Credential information inside a bordered plaque
 * - Bottom triad: Scannable QR code, 4 distinct vector medallions, authentic founder signature
 * - Bottom verification URL footnote safely above the border
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
  const width = 841.89;
  const height = 595.28;

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

  // 2. Inner Parchment Panel
  const margin = 20;
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
  const innerMargin = 27;
  page.drawRectangle({
    x: innerMargin,
    y: innerMargin,
    width: width - innerMargin * 2,
    height: height - innerMargin * 2,
    borderColor: colors.secondary,
    borderWidth: 0.75
  });

  // Corner Bracket & Accent Details (Institutional framing)
  const cornerIndent = 12;
  const corners = [
    { x: innerMargin, y: height - innerMargin, dx: 1, dy: -1 },
    { x: width - innerMargin, y: height - innerMargin, dx: -1, dy: -1 },
    { x: innerMargin, y: innerMargin, dx: 1, dy: 1 },
    { x: width - innerMargin, y: innerMargin, dx: -1, dy: 1 }
  ];

  for (const c of corners) {
    // Corner join step
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
    // Diagonal corner accent
    page.drawLine({
      start: { x: c.x + c.dx * 2, y: c.y + c.dy * 10 },
      end: { x: c.x + c.dx * 10, y: c.y + c.dy * 2 },
      thickness: 0.75,
      color: colors.secondary
    });
  }

  // 4. Embed Brand Assets
  const publicDir = path.join(process.cwd(), 'public');

  // Upper Left Emblem (apple-touch-icon.png)
  const iconPath = path.join(publicDir, 'apple-touch-icon.png');
  if (fs.existsSync(iconPath)) {
    try {
      const iconBytes = fs.readFileSync(iconPath);
      const iconImg = await pdfDoc.embedPng(iconBytes);
      page.drawImage(iconImg, {
        x: 48,
        y: height - 88,
        width: 44,
        height: 44
      });
    } catch (e) {
      console.warn('Emblem embed failed:', e.message);
    }
  }

  // Main AlgoMania Wordmark Logo (centered near top)
  const logoPath = path.join(publicDir, 'AlgoMania Interactive Algorithm Lab Logo.png');
  if (fs.existsSync(logoPath)) {
    try {
      const logoBytes = fs.readFileSync(logoPath);
      const logoImg = await pdfDoc.embedPng(logoBytes);
      const logoWidth = 195;
      const logoHeight = (logoWidth / logoImg.width) * logoImg.height;
      page.drawImage(logoImg, {
        x: (width - logoWidth) / 2,
        y: height - 94,
        width: logoWidth,
        height: logoHeight
      });
    } catch (e) {
      console.warn('Logo embed failed:', e.message);
    }
  }

  // 5. Shaped Category Ribbon / Cartouche
  const categoryText = themeConfig.categoryLabel;
  const ribbonCenterY = height - 124;
  const ribbonTextWidth = fontSansBold.widthOfTextAtSize(categoryText, 10.5);
  const ribbonWidth = Math.max(380, ribbonTextWidth + 48);
  const ribbonHeight = 25;
  const ribbonLeft = (width - ribbonWidth) / 2;
  const ribbonRight = (width + ribbonWidth) / 2;
  const ribbonBottom = ribbonCenterY - ribbonHeight / 2;

  // Draw main ribbon body with swallowtail notches
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
  const flourishLen = 42;
  // Left line with diamond tip
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

  // Right line with diamond tip
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
    size: 10.5,
    font: fontSansBold,
    color: colors.ribbonText
  });

  // 6. "PROUDLY PRESENTED TO"
  const certifyText = 'P R O U D L Y   P R E S E N T E D   T O';
  const certifyWidth = fontSans.widthOfTextAtSize(certifyText, 8.5);
  page.drawText(certifyText, {
    x: (width - certifyWidth) / 2,
    y: height - 158,
    size: 8.5,
    font: fontSans,
    color: colors.textMuted
  });

  // 7. Recipient Name (Prominent Serif with boundary scaling)
  let nameSize = 34;
  let nameWidth = fontSerifBold.widthOfTextAtSize(recipientName, nameSize);
  const maxNameWidth = width - 160;
  if (nameWidth > maxNameWidth) {
    nameSize = Math.floor(nameSize * (maxNameWidth / nameWidth));
    nameWidth = fontSerifBold.widthOfTextAtSize(recipientName, nameSize);
  }
  page.drawText(recipientName, {
    x: (width - nameWidth) / 2,
    y: height - 198,
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

  let l1Size = 12.5;
  let l1Width = fontSerifItalic.widthOfTextAtSize(line1, l1Size);
  if (l1Width > width - 140) {
    l1Size = Math.floor(l1Size * ((width - 140) / l1Width) * 10) / 10;
    l1Width = fontSerifItalic.widthOfTextAtSize(line1, l1Size);
  }
  page.drawText(line1, {
    x: (width - l1Width) / 2,
    y: height - 230,
    size: l1Size,
    font: fontSerifItalic,
    color: colors.textMuted
  });

  let l2Size = 12.5;
  let l2Width = fontSerifBold.widthOfTextAtSize(line2, l2Size);
  if (l2Width > width - 140) {
    l2Size = Math.floor(l2Size * ((width - 140) / l2Width) * 10) / 10;
    l2Width = fontSerifBold.widthOfTextAtSize(line2, l2Size);
  }
  page.drawText(line2, {
    x: (width - l2Width) / 2,
    y: height - 248,
    size: l2Size,
    font: fontSerifBold,
    color: colors.textDark
  });

  // 9. Credential Information Plaque Box
  const boxWidth = 520;
  const boxHeight = 32;
  const boxX = (width - boxWidth) / 2;
  const boxY = height - 296;

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
  let dSize = 8.5;
  let dWidth = fontSans.widthOfTextAtSize(dateSub, dSize);
  if (dWidth > boxWidth - 28) {
    dSize = Math.floor(dSize * ((boxWidth - 28) / dWidth) * 10) / 10;
    dWidth = fontSans.widthOfTextAtSize(dateSub, dSize);
  }
  page.drawText(dateSub, {
    x: (width - dWidth) / 2,
    y: boxY + 11,
    size: dSize,
    font: fontSans,
    color: colors.textDark
  });

  // --- 10. BOTTOM TRIAD (QR Code, Medallion, Signature) ---

  // A. Left: Scannable QR Code
  const qrX = 66;
  const qrY = 74;
  const qrSize = 64;

  try {
    const qrPngDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 140,
      color: { dark: themeConfig.colors.textDark, light: themeConfig.colors.innerBg }
    });
    const qrBase64 = qrPngDataUrl.split(',')[1];
    const qrBytes = Buffer.from(qrBase64, 'base64');
    const qrImg = await pdfDoc.embedPng(qrBytes);

    page.drawImage(qrImg, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize
    });

    page.drawText('Scan to Verify', {
      x: qrX,
      y: qrY - 11,
      size: 8,
      font: fontSansBold,
      color: colors.primary
    });

    page.drawText('Official Credential', {
      x: qrX,
      y: qrY - 20,
      size: 6.5,
      font: fontSans,
      color: colors.textMuted
    });
  } catch (qrErr) {
    console.error('Error embedding QR code into PDF:', qrErr);
  }

  // Left vertical divider
  page.drawLine({
    start: { x: 168, y: 64 },
    end: { x: 168, y: 146 },
    thickness: 0.5,
    color: colors.secondary
  });

  // B. Center: Distinct Official Medallion
  const sealCenterX = width / 2;
  const sealCenterY = 106;
  const sealOuterR = 40;

  // 1. Outer Scalloped / Milled / Beveled Rim per Theme
  if (themeConfig.id === 'competition_gold') {
    // 32-point radiant sunburst outer edge
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
    // Scalloped coin bezel
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
    // Precision milled rim with 16 radial accent pips
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
    size: sealOuterR - 3.5,
    borderColor: colors.accent,
    borderWidth: 0.75
  });

  // Solid Core Circle in Theme Color
  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: sealOuterR - 5.5,
    color: colors.sealCore,
    borderColor: colors.accent,
    borderWidth: 1
  });

  // Draw Laurel Wreath Branches
  try {
    // Scale and translate laurel paths to seal core coordinates
    // Seal center is (sealCenterX, sealCenterY), radius ~34
    // Path original is 100x100 viewBox centered at (50, 50)
    // Scale factor is ~0.68, dx = sealCenterX - 34, dy = sealCenterY - 34
    const laurelScale = 0.68;
    const laurelX = sealCenterX - 50 * laurelScale;
    const laurelY = sealCenterY - 50 * laurelScale;

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

    // Tier specific emblem above center milestone
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

  // Right vertical divider
  page.drawLine({
    start: { x: width - 168, y: 64 },
    end: { x: width - 168, y: 146 },
    thickness: 0.5,
    color: colors.secondary
  });

  // C. Right: Founder Signature & Authorization Area
  const sigX = width - 200;
  const sigY = 92;
  const sigWidth = 110;

  const sigPath = path.join(publicDir, 'LakhansingSignature.png');
  if (fs.existsSync(sigPath)) {
    try {
      const sigBytes = fs.readFileSync(sigPath);
      const sigImg = await pdfDoc.embedPng(sigBytes);
      const sigHeight = (sigWidth / sigImg.width) * sigImg.height;

      page.drawImage(sigImg, {
        x: sigX + (136 - sigWidth) / 2,
        y: sigY - 2,
        width: sigWidth,
        height: sigHeight
      });
    } catch (e) {
      console.warn('Signature embed failed:', e.message);
    }
  }

  // Signature rule line
  page.drawLine({
    start: { x: sigX, y: sigY + 10 },
    end: { x: sigX + 136, y: sigY + 10 },
    thickness: 1,
    color: colors.primary
  });

  // Founder Name & Title
  const signeeName = 'Lakhansing Patil';
  const snWidth = fontSansBold.widthOfTextAtSize(signeeName, 10);
  page.drawText(signeeName, {
    x: sigX + (136 - snWidth) / 2,
    y: sigY - 4,
    size: 10,
    font: fontSansBold,
    color: colors.textDark
  });

  const signeeTitle = 'Founder, AlgoMania';
  const stitleWidth = fontSans.widthOfTextAtSize(signeeTitle, 8.5);
  page.drawText(signeeTitle, {
    x: sigX + (136 - stitleWidth) / 2,
    y: sigY - 16,
    size: 8.5,
    font: fontSans,
    color: colors.primary
  });

  // 11. Verification URL Footnote (Positioned safely above bottom border)
  const footnote = `Official validation record securely hosted at: ${verificationUrl}`;
  let fnSize = 7.5;
  let fnWidth = fontSans.widthOfTextAtSize(footnote, fnSize);
  if (fnWidth > width - 100) {
    fnSize = Math.floor(fnSize * ((width - 100) / fnWidth) * 10) / 10;
    fnWidth = fontSans.widthOfTextAtSize(footnote, fnSize);
  }
  page.drawText(footnote, {
    x: (width - fnWidth) / 2,
    y: 44,
    size: fnSize,
    font: fontSans,
    color: colors.textMuted
  });

  return await pdfDoc.save();
}
