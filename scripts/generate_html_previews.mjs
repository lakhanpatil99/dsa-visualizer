import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { CERTIFICATE_THEMES } from '../lib/certificates/certificateThemes.js';
import { 
  LAUREL_LEFT_PATH, 
  LAUREL_RIGHT_PATH, 
  STAR_EMBLEM_PATH, 
  SHIELD_EMBLEM_PATH, 
  CROWN_EMBLEM_PATH, 
  GRAD_CAP_PATH 
} from '../lib/certificates/certificateMedallions.js';

const publicDir = path.resolve('public');
const logoBase64 = fs.readFileSync(path.join(publicDir, 'AlgoMania Interactive Algorithm Lab Logo.png')).toString('base64');
const emblemBase64 = fs.readFileSync(path.join(publicDir, 'apple-touch-icon.png')).toString('base64');
const sigBase64 = fs.readFileSync(path.join(publicDir, 'LakhansingSignature.png')).toString('base64');

async function renderCertificateCard(cert) {
  const theme = CERTIFICATE_THEMES[cert.type];
  const isBronze = cert.type === 'competition_bronze';
  const isSilver = cert.type === 'competition_silver';
  const isGold = cert.type === 'competition_gold';
  const isInternship = cert.type === 'internship';

  const qrUrl = await QRCode.toDataURL(cert.verificationUrl, {
    margin: 1,
    width: 140,
    color: { dark: theme.colors.textDark, light: theme.colors.innerBg }
  });

  const milestoneText = typeof theme.seal.milestone === 'function'
    ? theme.seal.milestone(cert.milestoneCount)
    : theme.seal.milestone;

  const line1 = isInternship
    ? theme.narrative.line1(cert.duration)
    : theme.narrative.line1;
  const line2 = isInternship
    ? theme.narrative.line2(cert.domain)
    : theme.narrative.line2(cert.milestoneCount);

  let emblemSvg = STAR_EMBLEM_PATH;
  if (isSilver) emblemSvg = SHIELD_EMBLEM_PATH;
  if (isGold) emblemSvg = CROWN_EMBLEM_PATH;
  if (isInternship) emblemSvg = GRAD_CAP_PATH;

  let rimDetails = '';
  if (isGold) {
    rimDetails = Array.from({ length: 32 }).map((_, i) => {
      const angle = (i * 360) / 32;
      return `<circle cx="50" cy="2.5" r="2.2" fill="${theme.colors.accent}" transform="rotate(${angle} 50 50)" />`;
    }).join('');
  } else if (isBronze) {
    rimDetails = Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 360) / 24;
      return `<circle cx="50" cy="3.5" r="2" fill="${theme.colors.secondary}" transform="rotate(${angle} 50 50)" />`;
    }).join('');
  } else if (isSilver) {
    rimDetails = Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16;
      return `<line x1="50" y1="2" x2="50" y2="6" stroke="${theme.colors.accent}" stroke-width="1" transform="rotate(${angle} 50 50)" />`;
    }).join('');
  } else {
    rimDetails = Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 360) / 8;
      return `<circle cx="50" cy="3" r="1.8" fill="${theme.colors.secondary}" transform="rotate(${angle} 50 50)" />`;
    }).join('');
  }

  return `
    <div style="background-color: ${theme.colors.background}; border: 3px solid ${theme.colors.primary}; border-radius: 16px; padding: 18px; box-shadow: 0 10px 25px rgba(0,0,0,0.12); width: 842px; height: 595px; box-sizing: border-box; position: relative; margin: 30px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      
      <!-- Inner Panel -->
      <div style="background-color: ${theme.colors.innerBg}; border: 1.5px solid ${theme.colors.secondary}; border-radius: 12px; height: 100%; box-sizing: border-box; padding: 24px 32px; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
        
        <!-- Corner Accents -->
        <div style="position: absolute; top: 8px; left: 8px; width: 16px; height: 16px; border-top: 1.5px solid ${theme.colors.accent}; border-left: 1.5px solid ${theme.colors.accent};"></div>
        <div style="position: absolute; top: 8px; right: 8px; width: 16px; height: 16px; border-top: 1.5px solid ${theme.colors.accent}; border-right: 1.5px solid ${theme.colors.accent};"></div>
        <div style="position: absolute; bottom: 8px; left: 8px; width: 16px; height: 16px; border-bottom: 1.5px solid ${theme.colors.accent}; border-left: 1.5px solid ${theme.colors.accent};"></div>
        <div style="position: absolute; bottom: 8px; right: 8px; width: 16px; height: 16px; border-bottom: 1.5px solid ${theme.colors.accent}; border-right: 1.5px solid ${theme.colors.accent};"></div>

        <!-- Top Header -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <img src="data:image/png;base64,${emblemBase64}" style="width: 44px; height: 44px; object-fit: contain;" />
          <img src="data:image/png;base64,${logoBase64}" style="height: 44px; width: auto; object-fit: contain;" />
          <div style="width: 44px;"></div>
        </div>

        <!-- Category Ribbon Cartouche -->
        <div style="display: flex; align-items: center; justify-content: center; margin: 4px 0;">
          <div style="width: 50px; height: 1px; background-color: ${theme.colors.secondary}; margin-right: 8px;"></div>
          <div style="background-color: ${theme.colors.ribbonBg}; border: 1.5px solid ${theme.colors.ribbonBorder}; border-radius: 6px; padding: 6px 24px; color: ${theme.colors.ribbonText}; font-family: monospace; font-size: 11px; font-weight: bold; letter-spacing: 2px;">
            ${theme.categoryLabel}
          </div>
          <div style="width: 50px; height: 1px; background-color: ${theme.colors.secondary}; margin-left: 8px;"></div>
        </div>

        <!-- Proudly Presented To -->
        <div style="text-align: center;">
          <div style="font-size: 10px; font-family: sans-serif; letter-spacing: 3px; color: ${theme.colors.textMuted}; text-transform: uppercase;">
            P R O U D L Y &nbsp; P R E S E N T E D &nbsp; T O
          </div>
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 34px; font-weight: bold; color: ${theme.colors.primary}; margin: 6px 0;">
            ${cert.recipientName}
          </div>
          <div style="font-style: italic; font-family: 'Times New Roman', Times, serif; font-size: 13.5px; color: ${theme.colors.textMuted};">
            ${line1}
          </div>
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 13.5px; font-weight: bold; color: ${theme.colors.textDark}; margin-top: 2px;">
            ${line2}
          </div>
        </div>

        <!-- Plaque -->
        <div style="background-color: ${theme.colors.plaqueBg}; border: 1px solid ${theme.colors.plaqueBorder}; border-radius: 6px; padding: 7px 18px; margin: 0 auto; text-align: center; max-width: 540px; font-family: monospace; font-size: 10.5px; color: ${theme.colors.textDark};">
          <span>Issued on: <strong>November 17, 2026</strong></span>
          <span style="color: ${theme.colors.secondary}; margin: 0 10px;">•</span>
          <span>Credential ID: <strong>${cert.certificateId}</strong></span>
        </div>

        <!-- Bottom Triad -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; border-top: 1px solid ${theme.colors.secondary}50; padding-top: 10px;">
          <!-- Left: QR -->
          <div style="display: flex; flex-direction: column; align-items: flex-start; padding-left: 10px;">
            <img src="${qrUrl}" style="width: 62px; height: 62px; border: 1px solid ${theme.colors.plaqueBorder}; border-radius: 4px;" />
            <span style="font-family: monospace; font-size: 9.5px; font-weight: bold; color: ${theme.colors.primary}; margin-top: 4px;">Scan to Verify</span>
            <span style="font-family: monospace; font-size: 8px; color: ${theme.colors.textMuted};">Official Credential</span>
          </div>

          <!-- Center: Medallion -->
          <div style="display: flex; justify-content: center;">
            <svg viewBox="0 0 100 100" style="width: 96px; height: 96px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));">
              ${rimDetails}
              <circle cx="50" cy="50" r="46" fill="${theme.colors.sealOuter}" stroke="${theme.colors.accent}" stroke-width="1.5" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="${theme.colors.accent}" stroke-width="0.8" />
              <circle cx="50" cy="50" r="38" fill="${theme.colors.sealCore}" stroke="${theme.colors.accent}" stroke-width="1" />
              <g fill="${theme.colors.sealLaurel}">
                <path d="${LAUREL_LEFT_PATH}" />
                <path d="${LAUREL_RIGHT_PATH}" />
              </g>
              <g fill="${theme.colors.sealLaurel}" stroke="${theme.colors.accent}" stroke-width="0.3">
                <path d="${emblemSvg}" />
              </g>
              <text x="50" y="27" text-anchor="middle" fill="${theme.colors.sealText}" font-size="5" font-weight="bold" letter-spacing="0.8" font-family="sans-serif">${theme.seal.institution}</text>
              <text x="50" y="${isInternship ? 48 : 49}" text-anchor="middle" fill="${theme.colors.sealText}" font-size="${isInternship ? 6 : 7.5}" font-weight="bold" font-family="sans-serif">${milestoneText}</text>
              <text x="50" y="60" text-anchor="middle" fill="${theme.colors.sealSubtext}" font-size="4.8" font-weight="bold" letter-spacing="0.4" font-family="sans-serif">${theme.seal.tierLabel}</text>
              <text x="50" y="71" text-anchor="middle" fill="${theme.colors.sealSubtext}" font-size="4.2" font-family="sans-serif">OFFICIAL SEAL</text>
            </svg>
          </div>

          <!-- Right: Signature -->
          <div style="display: flex; flex-direction: column; align-items: flex-end; padding-right: 10px;">
            <img src="data:image/png;base64,${sigBase64}" style="height: 52px; width: auto; object-fit: contain; margin-bottom: -6px;" />
            <div style="width: 140px; height: 1.5px; background-color: ${theme.colors.primary}; margin-bottom: 3px;"></div>
            <span style="font-size: 11px; font-weight: bold; color: ${theme.colors.textDark};">Lakhansing Patil</span>
            <span style="font-family: monospace; font-size: 9.5px; color: ${theme.colors.primary};">Founder, AlgoMania</span>
          </div>
        </div>

        <!-- Verification Footnote -->
        <div style="text-align: center; border-top: 1px solid ${theme.colors.secondary}30; padding-top: 4px; font-family: monospace; font-size: 8px; color: ${theme.colors.textMuted};">
          Official validation record securely hosted at: ${cert.verificationUrl}
        </div>

      </div>
    </div>
  `;
}

async function run() {
  const sampleCerts = [
    {
      type: 'competition_bronze',
      certificateId: 'ALG-CMP-BR-2026-B400DC6F31B20D9776DA8A9D1B10DE74',
      recipientName: 'Lakhansing Patil',
      milestoneCount: 20,
      verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-BR-2026-B400DC6F31B20D9776DA8A9D1B10DE74'
    },
    {
      type: 'competition_silver',
      certificateId: 'ALG-CMP-SL-2026-E78A9C123F45D67890ABCDEF12345678',
      recipientName: 'Aarav Sharma',
      milestoneCount: 100,
      verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-SL-2026-E78A9C123F45D67890ABCDEF12345678'
    },
    {
      type: 'competition_gold',
      certificateId: 'ALG-CMP-GD-2026-99F123456789ABCDEF0123456789ABCD',
      recipientName: 'Priya Sundaram',
      milestoneCount: 200,
      verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-GD-2026-99F123456789ABCDEF0123456789ABCD'
    },
    {
      type: 'internship',
      certificateId: 'ALG-INT-JV-2026-A1B2C3D4E5F67890123456789ABCDEF0',
      recipientName: 'Lakhansing Patil',
      domain: 'Software Engineering (Java)',
      duration: '2 Months',
      verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-INT-JV-2026-A1B2C3D4E5F67890123456789ABCDEF0'
    }
  ];

  let cardsHtml = '';
  for (const cert of sampleCerts) {
    cardsHtml += await renderCertificateCard(cert);
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AlgoMania Premium Institutional Certificates Preview</title>
        <style>
          body {
            background-color: #1A1A18;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          h1 {
            color: #F8F5ED;
            font-family: sans-serif;
            text-align: center;
            margin-bottom: 10px;
          }
          p.subtitle {
            color: #A8A49C;
            font-family: monospace;
            text-align: center;
            margin-bottom: 30px;
          }
        </style>
      </head>
      <body>
        <h1>AlgoMania Institutional Credential System</h1>
        <p class="subtitle">Four Distinct Institutional Themes: Bronze, Silver, Gold, and Fellowship</p>
        ${cardsHtml}
      </body>
    </html>
  `;

  fs.writeFileSync('tests/output/preview.html', html);
  console.log('Generated tests/output/preview.html successfully');
}

run().catch(console.error);
