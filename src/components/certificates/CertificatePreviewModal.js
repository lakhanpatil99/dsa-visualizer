import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { getCertificateTheme } from '../../../lib/certificates/certificateThemes.js';
import {
  LAUREL_LEFT_PATH,
  LAUREL_RIGHT_PATH,
  STAR_EMBLEM_PATH,
  SHIELD_EMBLEM_PATH,
  CROWN_EMBLEM_PATH,
  GRAD_CAP_PATH
} from '../../../lib/certificates/certificateMedallions.js';

/**
 * Universal AlgoMania Institutional Certificate Preview Modal.
 * Faithfully matches the exact A4 landscape institutional aesthetic:
 *  - 4 Distinct Credential Identities (Bronze, Silver, Gold, Internship)
 *  - 4 Independently Recognizable Vector Medallions
 *  - Shaped swallowtail category ribbon with flourish extensions
 *  - High-precision typography and institutional framing
 *  - Zoom controls (Zoom In, Zoom Out, Fit-to-screen)
 *  - Support for ISSUED, LOCKED, SAMPLE, PENDING_ISSUANCE, and REVOKED states
 */

function CertificateMedallionSvg({ theme, milestoneCount, isIssued }) {
  const isGold = theme.id === 'competition_gold';
  const isSilver = theme.id === 'competition_silver';
  const isBronze = theme.id === 'competition_bronze';
  const isInternship = theme.id === 'internship';

  const milestoneText = typeof theme.seal.milestone === 'function'
    ? theme.seal.milestone(milestoneCount)
    : theme.seal.milestone;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md select-none"
        aria-label={`${theme.name} Official Medallion`}
      >
        <defs>
          <radialGradient id={`medallionGrad-${theme.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.colors.sealCore} stopOpacity="0.9" />
            <stop offset="100%" stopColor={theme.colors.sealCore} stopOpacity="1" />
          </radialGradient>
          <linearGradient id={`goldRim-${theme.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.colors.accent} />
            <stop offset="50%" stopColor={theme.colors.secondary} />
            <stop offset="100%" stopColor={theme.colors.accent} />
          </linearGradient>
        </defs>

        {/* 1. Outer Distinct Rim Styling */}
        {isGold && (
          <g>
            {/* 32-point radiant sunburst teeth */}
            {Array.from({ length: 32 }).map((_, i) => {
              const angle = (i * 360) / 32;
              return (
                <circle
                  key={i}
                  cx="50"
                  cy="2.5"
                  r="2.2"
                  fill={theme.colors.accent}
                  transform={`rotate(${angle} 50 50)`}
                />
              );
            })}
          </g>
        )}

        {isBronze && (
          <g>
            {/* Scalloped coin bezel */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              return (
                <circle
                  key={i}
                  cx="50"
                  cy="3.5"
                  r="2"
                  fill={theme.colors.secondary}
                  transform={`rotate(${angle} 50 50)`}
                />
              );
            })}
          </g>
        )}

        {isSilver && (
          <g>
            {/* 16 Precision milled radial hatch ticks */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              return (
                <line
                  key={i}
                  x1="50"
                  y1="2"
                  x2="50"
                  y2="6"
                  stroke={theme.colors.accent}
                  strokeWidth="1"
                  transform={`rotate(${angle} 50 50)`}
                />
              );
            })}
          </g>
        )}

        {isInternship && (
          <g>
            {/* 8 Technical compass bezel pips */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 360) / 8;
              return (
                <circle
                  key={i}
                  cx="50"
                  cy="3"
                  r="1.8"
                  fill={theme.colors.secondary}
                  transform={`rotate(${angle} 50 50)`}
                />
              );
            })}
          </g>
        )}

        {/* Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill={theme.colors.sealOuter}
          stroke={theme.colors.accent}
          strokeWidth="1.5"
        />

        {/* Concentric Relief Ring */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth="0.8"
        />

        {/* Solid Theme Core */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill={`url(#medallionGrad-${theme.id})`}
          stroke={theme.colors.accent}
          strokeWidth="1"
        />

        {/* Laurel Wreath */}
        <g fill={theme.colors.sealLaurel} opacity="0.95">
          <path d={LAUREL_LEFT_PATH} />
          <path d={LAUREL_RIGHT_PATH} />
        </g>

        {/* Distinct Emblem Symbol */}
        <g fill={theme.colors.sealLaurel} stroke={theme.colors.accent} strokeWidth="0.3">
          {isBronze && <path d={STAR_EMBLEM_PATH} />}
          {isSilver && <path d={SHIELD_EMBLEM_PATH} />}
          {isGold && <path d={CROWN_EMBLEM_PATH} />}
          {isInternship && <path d={GRAD_CAP_PATH} />}
        </g>

        {/* Typography */}
        {/* Top: Institution */}
        <text
          x="50"
          y="28"
          textAnchor="middle"
          fill={theme.colors.sealText}
          fontSize="5"
          fontWeight="bold"
          letterSpacing="0.8"
          fontFamily="system-ui, sans-serif"
        >
          {theme.seal.institution}
        </text>

        {/* Center: Milestone */}
        <text
          x="50"
          y={isInternship ? "48" : "49"}
          textAnchor="middle"
          fill={theme.colors.sealText}
          fontSize={isInternship ? "6" : "7.5"}
          fontWeight="bold"
          letterSpacing="0.2"
          fontFamily="system-ui, sans-serif"
        >
          {milestoneText}
        </text>

        {/* Subtitle: Tier */}
        <text
          x="50"
          y="60"
          textAnchor="middle"
          fill={theme.colors.sealSubtext}
          fontSize="4.8"
          fontWeight="bold"
          letterSpacing="0.4"
          fontFamily="system-ui, sans-serif"
        >
          {theme.seal.tierLabel}
        </text>

        {/* Bottom: Official Badge */}
        <text
          x="50"
          y="71"
          textAnchor="middle"
          fill={theme.colors.sealSubtext}
          fontSize="4.2"
          letterSpacing="0.5"
          fontFamily="system-ui, sans-serif"
        >
          {isIssued ? theme.seal.badgeText : 'SAMPLE SEAL'}
        </text>
      </svg>
    </div>
  );
}

export default function CertificatePreviewModal({
  certificate,
  isOpen,
  onClose,
  onDownload,
  onShare,
  mode = 'ISSUED', // 'ISSUED' | 'LOCKED' | 'SAMPLE' | 'PENDING_ISSUANCE' | 'REVOKED'
  userSolvedCount = 0,
  requiredCount = 20
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [zoomScale, setZoomScale] = useState(1);

  const isRevoked = mode === 'REVOKED' || certificate?.status === 'REVOKED';
  const isIssued = mode === 'ISSUED' && !isRevoked;
  const isLocked = mode === 'LOCKED';
  const isPending = mode === 'PENDING_ISSUANCE';
  const isSample = mode === 'SAMPLE' || isLocked || isPending || isRevoked;

  const theme = getCertificateTheme(certificate?.type);

  useEffect(() => {
    if (!certificate) return;
    const url = (isIssued || isRevoked) && certificate?.verificationUrl
      ? certificate.verificationUrl
      : (isIssued || isRevoked) && certificate?.certificateId
        ? `https://www.algomania.in/certificates/verify/${certificate.certificateId}`
        : 'https://www.algomania.in/certificates/verify';

    QRCode.toDataURL(url, {
      margin: 1,
      width: 140,
      color: { dark: theme.colors.textDark, light: theme.colors.innerBg }
    }).then(setQrDataUrl).catch(() => {});
  }, [certificate, isIssued, isRevoked, theme]);

  if (!isOpen || !certificate) return null;

  const issueDateFormatted = isIssued
    ? new Date(certificate.issueDate || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Milestone Completion Date';

  const displayCertificateId = (isIssued || isRevoked)
    ? certificate.certificateId
    : 'SAMPLE PREVIEW — NO OFFICIAL ID';

  const remainingProblems = Math.max(0, requiredCount - userSolvedCount);
  const progressPercent = Math.min(100, Math.round((userSolvedCount / (requiredCount || 1)) * 100));

  const isInternship = theme.id === 'internship';
  const line1 = isInternship
    ? theme.narrative.line1(certificate.duration)
    : theme.narrative.line1;
  const line2 = isInternship
    ? theme.narrative.line2(certificate.domain)
    : theme.narrative.line2(certificate.milestoneCount);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="relative w-full max-w-5xl bg-[#FFFDF9] dark:bg-[#1C1B18] rounded-2xl shadow-2xl overflow-hidden border border-[#DED9CE] dark:border-[#383630] flex flex-col max-h-[95vh]">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-[#F8F5ED] dark:bg-[#252420] border-b border-[#DED9CE] dark:border-[#383630] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: isIssued ? theme.colors.primary : isRevoked ? '#DC2626' : isLocked ? '#CD7F32' : '#EF592A' }}
            ></span>
            <span id="modal-headline" className="text-xs sm:text-sm font-mono font-bold text-[#24231F] dark:text-[#FFFDF8] uppercase tracking-wide">
              {isIssued
                ? 'Official Credential Preview'
                : isRevoked
                  ? 'Revoked Credential Record'
                  : isLocked
                    ? 'Locked Milestone Preview'
                    : isPending
                      ? 'Achievement Awaiting Official Issuance'
                      : 'Sample Credential Preview'}
            </span>
          </div>

          {/* Action & Zoom Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center space-x-1 bg-white dark:bg-[#2C2A24] border border-[#DED9CE] dark:border-[#423F38] rounded-lg px-2 py-1 text-xs font-mono">
              <button
                onClick={() => setZoomScale(Math.max(0.7, zoomScale - 0.1))}
                className="px-1.5 py-0.5 hover:text-[#EF592A] transition-colors"
                title="Zoom Out"
              >
                −
              </button>
              <span className="w-12 text-center text-[11px] font-semibold text-[#6E564F] dark:text-[#C5CCD2]">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale(Math.min(1.4, zoomScale + 0.1))}
                className="px-1.5 py-0.5 hover:text-[#EF592A] transition-colors"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="ml-1 pl-1 border-l border-[#DED9CE] text-[10px] text-[#718096] hover:text-[#24231F] dark:hover:text-white"
                title="Reset to 100%"
              >
                Fit
              </button>
            </div>

            {isIssued ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onDownload && onDownload(certificate)}
                  className="px-3.5 py-1.5 bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] rounded-xl text-xs font-semibold shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  Download Official PDF
                </button>
                {onShare && (
                  <button
                    onClick={() => onShare(certificate)}
                    className="px-3.5 py-1.5 border border-[#28533D]/30 text-[#28533D] dark:text-[#A8C8AE] rounded-xl text-xs font-semibold hover:bg-[#E4E9DD]/60 transition-colors cursor-pointer"
                  >
                    Share Credential ↗
                  </button>
                )}
              </div>
            ) : isLocked ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline-block px-3 py-1 rounded-lg bg-[#FAF4ED] dark:bg-[#332A24] border border-[#CD7F32]/30 text-[#8C5028] dark:text-[#E2A676] text-xs font-mono font-semibold">
                  🔒 {userSolvedCount} / {requiredCount} Solved ({remainingProblems} remaining)
                </span>
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-lg text-xs font-semibold">
                  🔒 Locked
                </span>
              </div>
            ) : isRevoked ? (
              <span className="px-3 py-1 rounded-lg bg-red-100 border border-red-300 text-red-800 text-xs font-mono font-semibold">
                REVOKED · NOT VALID
              </span>
            ) : isPending ? (
              <span className="px-3 py-1 rounded-lg bg-[#E4E9DD] border border-[#28533D]/20 text-[#28533D] text-xs font-mono font-semibold">
                Awaiting Issuance
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-[#EF592A]/10 border border-[#EF592A]/30 text-[#EF592A] text-xs font-mono font-semibold">
                Sample Representation
              </span>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#69665F] hover:text-[#24231F] dark:hover:text-[#FFFDF8] rounded-lg text-lg transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Milestone Banner (when locked) */}
        {isLocked && (
          <div className="px-5 py-2 bg-[#FAF4ED] dark:bg-[#2A231C] border-b border-[#EAD8C7] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center space-x-2 text-[#8C5028] dark:text-[#E2A676]">
              <span>🎯</span>
              <span>
                Milestone Requirement: Solve at least <strong>{requiredCount} unique algorithmic challenges</strong> to unlock this credential.
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-2 w-44">
              <div className="flex-1 bg-[#E4E9DD] h-2 rounded-full overflow-hidden">
                <div className="bg-[#EF592A] h-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#8C5028]">{progressPercent}%</span>
            </div>
          </div>
        )}

        {/* Certificate Display Parchment Area */}
        <div className="p-4 sm:p-8 overflow-auto flex-1 flex justify-center items-start bg-[#EFECE4] dark:bg-[#161513]">
          <div
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="w-full max-w-[842px] transition-all"
          >
            {/* Outer Parchment Container with Elegant Theme Background */}
            <div
              className="relative p-3.5 sm:p-5 rounded-2xl shadow-xl border-2"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.primary
              }}
            >
              {/* Prominent Diagonal Watermark for Locked or Sample Previews */}
              {isSample && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-30">
                  <div className="transform -rotate-25 select-none border-4 border-dashed border-[#EF592A]/40 text-[#EF592A]/25 text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-widest px-6 py-3 rounded-2xl whitespace-nowrap uppercase text-center">
                    {isRevoked
                      ? 'REVOKED — NOT A VALID CREDENTIAL'
                      : isLocked
                        ? 'LOCKED — SAMPLE PREVIEW'
                        : isPending
                          ? 'AWAITING ISSUANCE — SAMPLE ONLY'
                          : 'SAMPLE — NOT AN OFFICIAL CREDENTIAL'}
                  </div>
                </div>
              )}

              {/* Inner Parchment Panel with Solid Refined Framing */}
              <div
                className="relative p-5 sm:p-8 rounded-xl border border-solid shadow-xs"
                style={{
                  backgroundColor: theme.colors.innerBg,
                  borderColor: theme.colors.secondary
                }}
              >
                {/* Decorative Corner Accents */}
                <div
                  className="absolute top-2 left-2 w-4 h-4 border-t border-l"
                  style={{ borderColor: theme.colors.accent }}
                ></div>
                <div
                  className="absolute top-2 right-2 w-4 h-4 border-t border-r"
                  style={{ borderColor: theme.colors.accent }}
                ></div>
                <div
                  className="absolute bottom-2 left-2 w-4 h-4 border-b border-l"
                  style={{ borderColor: theme.colors.accent }}
                ></div>
                <div
                  className="absolute bottom-2 right-2 w-4 h-4 border-b border-r"
                  style={{ borderColor: theme.colors.accent }}
                ></div>

                {/* 1. Header Section: Logos */}
                <div className="flex items-center justify-between mb-2">
                  <img
                    src="/apple-touch-icon.png"
                    alt="AlgoMania Emblem"
                    className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
                  />
                  <img
                    src="/AlgoMania Interactive Algorithm Lab Logo.png"
                    alt="AlgoMania Wordmark"
                    className="h-9 sm:h-11 w-auto object-contain"
                  />
                  <div className="w-10 sm:w-11"></div> {/* Balance spacer */}
                </div>

                {/* 2. Shaped Category Ribbon / Cartouche */}
                <div className="my-3 flex items-center justify-center">
                  <div className="relative flex items-center">
                    {/* Left flourish line */}
                    <div
                      className="hidden sm:block w-8 sm:w-12 h-px mr-2"
                      style={{ backgroundColor: theme.colors.secondary }}
                    ></div>
                    {/* Ribbon Cartouche */}
                    <div
                      className="px-5 py-1.5 sm:px-8 sm:py-2 rounded-md shadow-xs text-center border"
                      style={{
                        backgroundColor: theme.colors.ribbonBg,
                        borderColor: theme.colors.ribbonBorder,
                        color: theme.colors.ribbonText
                      }}
                    >
                      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase">
                        {theme.categoryLabel}
                      </span>
                    </div>
                    {/* Right flourish line */}
                    <div
                      className="hidden sm:block w-8 sm:w-12 h-px ml-2"
                      style={{ backgroundColor: theme.colors.secondary }}
                    ></div>
                  </div>
                </div>

                {/* 3. Recipient & Narrative Header */}
                <div className="text-center my-3">
                  <p className="text-[10px] sm:text-[11px] font-sans tracking-widest uppercase text-[#6E564F]">
                    P R O U D L Y &nbsp; P R E S E N T E D &nbsp; T O
                  </p>
                  <h2
                    className="text-2xl sm:text-4xl font-serif font-bold my-2 tracking-tight"
                    style={{ color: theme.colors.primary }}
                  >
                    {certificate.recipientName || 'Candidate Name'}
                  </h2>

                  {/* Narrative Lines */}
                  <p className="text-xs sm:text-sm italic max-w-xl mx-auto leading-relaxed text-[#6E564F]">
                    {line1}
                  </p>
                  <p
                    className="text-xs sm:text-sm font-bold font-serif max-w-xl mx-auto leading-relaxed mt-0.5"
                    style={{ color: theme.colors.textDark }}
                  >
                    {line2}
                  </p>
                </div>

                {/* 4. Credential Information Plaque Box */}
                <div
                  className="my-4 px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg border max-w-xl mx-auto text-center shadow-2xs"
                  style={{
                    backgroundColor: theme.colors.plaqueBg,
                    borderColor: theme.colors.plaqueBorder
                  }}
                >
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] font-mono text-[#402B27]">
                    <span>Issued: <strong className="font-semibold">{issueDateFormatted}</strong></span>
                    <span className="text-[#A65E35]">•</span>
                    <span>Credential ID: <strong className="font-semibold break-all">{displayCertificateId}</strong></span>
                  </div>
                </div>

                {/* 5. Bottom Triad: QR, Medallion, Signature */}
                <div
                  className="grid grid-cols-3 gap-2 sm:gap-4 items-center pt-4 border-t mt-4"
                  style={{ borderColor: `${theme.colors.secondary}50` }}
                >
                  {/* Left: QR Code */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left pl-2">
                    {qrDataUrl && (
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded border"
                        style={{ borderColor: theme.colors.plaqueBorder }}
                      />
                    )}
                    <span
                      className="text-[9px] sm:text-[10px] font-mono font-bold mt-1"
                      style={{ color: theme.colors.primary }}
                    >
                      {isIssued ? 'Scan to Verify' : isRevoked ? 'Revocation Record' : 'Scan to Verify'}
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-mono text-[#6E564F]">
                      Official Credential
                    </span>
                  </div>

                  {/* Center: Distinct Vector Medallion */}
                  <div className="flex justify-center">
                    <CertificateMedallionSvg
                      theme={theme}
                      milestoneCount={certificate.milestoneCount}
                      isIssued={isIssued}
                    />
                  </div>

                  {/* Right: Founder Signature */}
                  <div className="flex flex-col items-center sm:items-end text-center sm:text-right pr-2">
                    <div className="relative flex items-end justify-center w-32 sm:w-36">
                      <img
                        src="/LakhansingSignature.png"
                        alt="Founder Signature"
                        className="h-16 w-auto max-w-[125px] object-contain -mb-2"
                      />
                    </div>
                    <div
                      className="w-32 sm:w-36 h-px mb-1"
                      style={{ backgroundColor: theme.colors.primary }}
                    ></div>
                    <span className="text-[11px] sm:text-xs font-bold text-[#24231F]">
                      Lakhansing Patil
                    </span>
                    <span
                      className="text-[9px] sm:text-[10px] font-mono"
                      style={{ color: theme.colors.primary }}
                    >
                      Founder, AlgoMania
                    </span>
                  </div>
                </div>

                {/* 6. Verification Footnote */}
                <div
                  className="text-center mt-3 pt-2 border-t"
                  style={{ borderColor: `${theme.colors.secondary}40` }}
                >
                  <p className="text-[8px] sm:text-[9px] font-mono text-[#6E564F] break-all px-2">
                    {isIssued
                      ? `Official validation record securely hosted at: ${certificate.verificationUrl}`
                      : isRevoked
                        ? `Revocation record: ${certificate.verificationUrl || `https://www.algomania.in/certificates/verify/${certificate.certificateId}`}`
                        : 'Sample credential preview. Official verifiable certificate issued upon verified completion and milestone fulfillment.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
