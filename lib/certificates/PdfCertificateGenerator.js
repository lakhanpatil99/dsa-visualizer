import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

/**
 * Professional A4 Landscape Academic Certificate Generator.
 * Conforms to exact AlgoMania branding:
 * - Brand emblem at upper-left (public/apple-touch-icon.png)
 * - Main wordmark centered (public/AlgoMania Interactive Algorithm Lab Logo.png)
 * - Founder signature authorized (public/LakhansingSignature.png)
 * - Real-time QR verification code
 * - 4 Distinct thematic color profiles: Internship, Bronze, Silver, Gold.
 */

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return rgb(r, g, b);
}

const THEMES = {
  internship: {
    primary: hexToRgb('#28533D'), // Forest Green
    secondary: hexToRgb('#EF592A'), // Burnt Orange
    accent: hexToRgb('#D4AF37'), // Muted Gold
    textDark: hexToRgb('#24231F'),
    textMuted: hexToRgb('#5C584E'),
    background: hexToRgb('#FAF8F3'),
    innerBg: hexToRgb('#FFFDF8'),
    categoryLabel: 'CERTIFICATE OF INTERNSHIP COMPLETION',
    sealText: 'VERIFIED INTERN'
  },
  competition_bronze: {
    primary: hexToRgb('#8C5028'), // Bronze metallic
    secondary: hexToRgb('#CD7F32'),
    accent: hexToRgb('#5C3415'),
    textDark: hexToRgb('#24231F'),
    textMuted: hexToRgb('#5C584E'),
    background: hexToRgb('#FAF6F0'),
    innerBg: hexToRgb('#FFFDF8'),
    categoryLabel: 'COMPETITION ACHIEVEMENT — BRONZE TIER',
    sealText: '20+ SOLVED'
  },
  competition_silver: {
    primary: hexToRgb('#4A5568'), // Platinum Silver
    secondary: hexToRgb('#718096'),
    accent: hexToRgb('#2D3748'),
    textDark: hexToRgb('#24231F'),
    textMuted: hexToRgb('#4A5568'),
    background: hexToRgb('#F7FAFC'),
    innerBg: hexToRgb('#FFFFFF'),
    categoryLabel: 'COMPETITION ACHIEVEMENT — SILVER TIER',
    sealText: '100+ SOLVED'
  },
  competition_gold: {
    primary: hexToRgb('#976E1A'), // Deep Gold
    secondary: hexToRgb('#D4AF37'), // Bright Gold
    accent: hexToRgb('#EF592A'), // Burnt Orange
    textDark: hexToRgb('#1A1814'),
    textMuted: hexToRgb('#5C4E28'),
    background: hexToRgb('#FAF7EE'),
    innerBg: hexToRgb('#FFFDF8'),
    categoryLabel: 'COMPETITION MASTERY — GOLD TIER',
    sealText: '200+ SOLVED'
  }
};

export async function generateCertificatePdf(certData) {
  const {
    certificateId,
    recipientName = 'Honored Scholar',
    type = 'internship',
    title = 'Software Engineering Program',
    domain = 'Java Development',
    tier = null,
    milestoneCount = null,
    duration = '2 Months',
    startDate = null,
    endDate = null,
    issueDate = new Date(),
    verificationUrl = `https://www.algomania.in/certificates/verify/${certificateId}`
  } = certData;

  const theme = THEMES[type] || THEMES.internship;

  // A4 Landscape dimensions (points)
  const width = 841.89;
  const height = 595.28;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([width, height]);

  // Load fonts
  const fontSerifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontSerifItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const fontSerif = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSans = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background Fill
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: theme.background
  });

  // Inner parchment panel
  const margin = 24;
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - margin * 2,
    height: height - margin * 2,
    color: theme.innerBg,
    borderColor: theme.primary,
    borderWidth: 2
  });

  // Inner delicate decorative border
  page.drawRectangle({
    x: margin + 6,
    y: margin + 6,
    width: width - (margin + 6) * 2,
    height: height - (margin + 6) * 2,
    borderColor: theme.secondary,
    borderWidth: 0.75
  });

  // Subtle corner join accents (academic institutional framing)
  const cornerAccent = 14;
  const outerBorder = margin + 6;
  const innerCorners = [
    { x: outerBorder, y: height - outerBorder, dx: 1, dy: -1 },
    { x: width - outerBorder, y: height - outerBorder, dx: -1, dy: -1 },
    { x: outerBorder, y: outerBorder, dx: 1, dy: 1 },
    { x: width - outerBorder, y: outerBorder, dx: -1, dy: 1 }
  ];
  for (const ic of innerCorners) {
    page.drawLine({
      start: { x: ic.x, y: ic.y + ic.dy * cornerAccent },
      end: { x: ic.x + ic.dx * cornerAccent, y: ic.y },
      thickness: 0.75,
      color: theme.accent
    });
  }

  // Embed Brand Assets
  const publicDir = path.join(process.cwd(), 'public');

  // 1. Upper Left Emblem (apple-touch-icon.png)
  const iconPath = path.join(publicDir, 'apple-touch-icon.png');
  if (fs.existsSync(iconPath)) {
    const iconBytes = fs.readFileSync(iconPath);
    const iconImg = await pdfDoc.embedPng(iconBytes);
    page.drawImage(iconImg, {
      x: 52,
      y: height - 90,
      width: 44,
      height: 44
    });
  }

  // 2. Main AlgoMania Wordmark Logo (centered near top)
  const logoPath = path.join(publicDir, 'AlgoMania Interactive Algorithm Lab Logo.png');
  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    const logoImg = await pdfDoc.embedPng(logoBytes);
    const logoWidth = 190;
    const logoHeight = (logoWidth / logoImg.width) * logoImg.height;
    page.drawImage(logoImg, {
      x: (width - logoWidth) / 2,
      y: height - 100,
      width: logoWidth,
      height: logoHeight
    });
  }

  // Category Banner / Header
  const categoryText = theme.categoryLabel;
  const categoryWidth = fontSansBold.widthOfTextAtSize(categoryText, 11);
  page.drawText(categoryText, {
    x: (width - categoryWidth) / 2,
    y: height - 126,
    size: 11,
    font: fontSansBold,
    color: theme.primary
  });

  // Thin separator under category
  page.drawLine({
    start: { x: (width - 300) / 2, y: height - 132 },
    end: { x: (width + 300) / 2, y: height - 132 },
    thickness: 1,
    color: theme.secondary
  });

  // "PROUDLY PRESENTED TO"
  const certifyText = 'PROUDLY PRESENTED TO';
  const certifyWidth = fontSans.widthOfTextAtSize(certifyText, 9.5);
  page.drawText(certifyText, {
    x: (width - certifyWidth) / 2,
    y: height - 162,
    size: 9.5,
    font: fontSans,
    color: theme.textMuted
  });

  // Recipient Name (Prominent serif with responsive boundary scaling)
  let nameSize = 30;
  let nameWidth = fontSerifBold.widthOfTextAtSize(recipientName, nameSize);
  const maxNameWidth = width - 160;
  if (nameWidth > maxNameWidth) {
    nameSize = Math.floor(nameSize * (maxNameWidth / nameWidth));
    nameWidth = fontSerifBold.widthOfTextAtSize(recipientName, nameSize);
  }
  page.drawText(recipientName, {
    x: (width - nameWidth) / 2,
    y: height - 202,
    size: nameSize,
    font: fontSerifBold,
    color: theme.textDark
  });

  // Name underline flourish
  page.drawLine({
    start: { x: (width - 360) / 2, y: height - 212 },
    end: { x: (width + 360) / 2, y: height - 212 },
    thickness: 1.5,
    color: theme.primary
  });

  // Narrative Description
  let narrativeText = '';
  let subNarrative = '';

  if (type === 'internship') {
    narrativeText = `for successfully completing the rigorous ${duration} engineering curriculum in`;
    subNarrative = `${domain} Track with verified algorithmic implementation and project defense.`;
  } else if (type === 'competition_bronze') {
    narrativeText = 'for demonstrating foundational algorithmic excellence by successfully solving';
    subNarrative = `${milestoneCount || 20}+ unique algorithmic challenges verified on the AlgoMania Competition Platform.`;
  } else if (type === 'competition_silver') {
    narrativeText = 'for distinguished computational problem-solving and algorithmic proficiency across';
    subNarrative = `${milestoneCount || 100}+ unique algorithmic challenges verified on the AlgoMania Competition Platform.`;
  } else if (type === 'competition_gold') {
    narrativeText = 'for exemplary computational mastery, exceptional data structure acumen, and solving';
    subNarrative = `${milestoneCount || 200}+ unique algorithmic challenges verified on the AlgoMania Competition Platform.`;
  }

  let nSize = 12.5;
  let nWidth = fontSerifItalic.widthOfTextAtSize(narrativeText, nSize);
  if (nWidth > width - 140) {
    nSize = Math.floor(nSize * ((width - 140) / nWidth) * 10) / 10;
    nWidth = fontSerifItalic.widthOfTextAtSize(narrativeText, nSize);
  }
  page.drawText(narrativeText, {
    x: (width - nWidth) / 2,
    y: height - 240,
    size: nSize,
    font: fontSerifItalic,
    color: theme.textMuted
  });

  let sSize = 12.5;
  let sWidth = fontSerifBold.widthOfTextAtSize(subNarrative, sSize);
  if (sWidth > width - 140) {
    sSize = Math.floor(sSize * ((width - 140) / sWidth) * 10) / 10;
    sWidth = fontSerifBold.widthOfTextAtSize(subNarrative, sSize);
  }
  page.drawText(subNarrative, {
    x: (width - sWidth) / 2,
    y: height - 260,
    size: sSize,
    font: fontSerifBold,
    color: theme.primary
  });

  // Program / Achievement Highlight Plaque (Generous width to prevent any ID collision)
  const boxWidth = 520;
  const boxHeight = 50;
  const boxX = (width - boxWidth) / 2;
  const boxY = height - 326;

  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: theme.background,
    borderColor: theme.secondary,
    borderWidth: 1
  });

  const highlightTitle = type === 'internship' ? title : `${theme.categoryLabel}`;
  const hWidth = fontSansBold.widthOfTextAtSize(highlightTitle, 10);
  page.drawText(highlightTitle, {
    x: (width - hWidth) / 2,
    y: boxY + 28,
    size: 10,
    font: fontSansBold,
    color: theme.primary
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
    color: theme.textMuted
  });

  // --- FOOTER & AUTHORIZATION SECTION ---

  // 1. Left: Dynamic QR Code
  try {
    const qrPngDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 140,
      color: { dark: '#24231F', light: '#FFFDF8' }
    });
    const qrBase64 = qrPngDataUrl.split(',')[1];
    const qrBytes = Buffer.from(qrBase64, 'base64');
    const qrImg = await pdfDoc.embedPng(qrBytes);

    const qrSize = 64;
    const qrX = 64;
    const qrY = 78;

    page.drawImage(qrImg, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize
    });

    page.drawText('Scan to Verify', {
      x: qrX,
      y: qrY - 11,
      size: 7.5,
      font: fontSansBold,
      color: theme.primary
    });

    page.drawText('Official Credential', {
      x: qrX,
      y: qrY - 20,
      size: 6.5,
      font: fontSans,
      color: theme.textMuted
    });
  } catch (qrErr) {
    console.error('Error embedding QR code into PDF:', qrErr);
  }

  // 2. Center: Official Academic Seal / Medal
  const sealCenterX = width / 2;
  const sealCenterY = 104;
  const sealRadius = 36;

  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: sealRadius,
    color: theme.background,
    borderColor: theme.secondary,
    borderWidth: 2
  });

  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: sealRadius - 4,
    borderColor: theme.primary,
    borderWidth: 0.75
  });

  const sealTitle = 'ALGOMANIA';
  const stWidth = fontSansBold.widthOfTextAtSize(sealTitle, 7);
  page.drawText(sealTitle, {
    x: sealCenterX - stWidth / 2,
    y: sealCenterY + 14,
    size: 7,
    font: fontSansBold,
    color: theme.primary
  });

  const sealMid = theme.sealText;
  const smWidth = fontSansBold.widthOfTextAtSize(sealMid, 8);
  page.drawText(sealMid, {
    x: sealCenterX - smWidth / 2,
    y: sealCenterY - 1,
    size: 8,
    font: fontSansBold,
    color: theme.secondary
  });

  const sealBottom = 'OFFICIAL SEAL';
  const sbWidth = fontSans.widthOfTextAtSize(sealBottom, 6);
  page.drawText(sealBottom, {
    x: sealCenterX - sbWidth / 2,
    y: sealCenterY - 14,
    size: 6,
    font: fontSans,
    color: theme.textMuted
  });

  // 3. Right: Founder Signature & Authorization Area
  const sigX = width - 204;
  const sigY = 94;
  const sigWidth = 110;

  const sigPath = path.join(publicDir, 'LakhansingSignature.png');
  if (fs.existsSync(sigPath)) {
    const sigBytes = fs.readFileSync(sigPath);
    const sigImg = await pdfDoc.embedPng(sigBytes);
    const sigHeight = (sigWidth / sigImg.width) * sigImg.height;

    page.drawImage(sigImg, {
      x: sigX + (140 - sigWidth) / 2,
      y: sigY - 2,
      width: sigWidth,
      height: sigHeight
    });
  }

  // Signature rule line
  page.drawLine({
    start: { x: sigX, y: sigY + 10 },
    end: { x: sigX + 140, y: sigY + 10 },
    thickness: 1,
    color: theme.primary
  });

  // Founder Name & Title
  const signeeName = 'Lakhansing Patil';
  const snWidth = fontSansBold.widthOfTextAtSize(signeeName, 10);
  page.drawText(signeeName, {
    x: sigX + (140 - snWidth) / 2,
    y: sigY - 4,
    size: 10,
    font: fontSansBold,
    color: theme.textDark
  });

  const signeeTitle = 'Founder, AlgoMania';
  const stitleWidth = fontSans.widthOfTextAtSize(signeeTitle, 8.5);
  page.drawText(signeeTitle, {
    x: sigX + (140 - stitleWidth) / 2,
    y: sigY - 16,
    size: 8.5,
    font: fontSans,
    color: theme.primary
  });

  // Verification URL footnote (Positioned safely above bottom border)
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
    color: theme.textMuted
  });

  return await pdfDoc.save();
}
