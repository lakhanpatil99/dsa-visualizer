import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function CertificatePreviewModal({ certificate, isOpen, onClose, onDownload }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (certificate?.verificationUrl) {
      QRCode.toDataURL(certificate.verificationUrl, {
        margin: 1,
        width: 140,
        color: { dark: '#24231F', light: '#FFFDF8' }
      }).then(setQrDataUrl).catch(() => {});
    }
  }, [certificate]);

  if (!isOpen || !certificate) return null;

  const isBronze = certificate.type === 'competition_bronze';
  const isSilver = certificate.type === 'competition_silver';
  const isGold = certificate.type === 'competition_gold';
  const isInternship = certificate.type === 'internship';

  // Theme borders & styling
  const borderColor = isGold
    ? 'border-[#D4AF37]'
    : isSilver
    ? 'border-[#718096]'
    : isBronze
    ? 'border-[#CD7F32]'
    : 'border-[#28533D]';

  const accentColor = isGold
    ? 'text-[#976E1A]'
    : isSilver
    ? 'text-[#4A5568]'
    : isBronze
    ? 'text-[#8C5028]'
    : 'text-[#28533D]';

  const categoryLabel = isGold
    ? 'COMPETITION MASTERY — GOLD TIER'
    : isSilver
    ? 'COMPETITION ACHIEVEMENT — SILVER TIER'
    : isBronze
    ? 'COMPETITION ACHIEVEMENT — BRONZE TIER'
    : 'CERTIFICATE OF INTERNSHIP COMPLETION';

  const issueDateFormatted = new Date(certificate.issueDate || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FFFDF8] dark:bg-[#1E1D19] rounded-2xl shadow-2xl overflow-hidden border border-[#DED9CE] dark:border-[#383630]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#F8F5ED] dark:bg-[#282723] border-b border-[#DED9CE] dark:border-[#383630] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#EF592A]"></span>
            <span className="text-sm font-mono font-bold text-[#24231F] dark:text-[#FFFDF8] uppercase tracking-wide">
              Official Credential Preview
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onDownload && onDownload(certificate)}
              className="px-4 py-2 bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] rounded-xl text-xs font-semibold shadow-xs transition-transform hover:scale-[1.02]"
            >
              Download Official PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#69665F] hover:text-[#24231F] dark:hover:text-[#FFFDF8] rounded-lg text-lg"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Parchment Body */}
        <div className="p-6 sm:p-10 overflow-y-auto max-h-[80vh]">
          <div className={`relative p-6 sm:p-10 bg-[#FAF7EE] rounded-xl border-4 ${borderColor} shadow-inner`}>
            {/* Delicate Inner Border */}
            <div className={`p-6 sm:p-8 border border-dashed ${borderColor} rounded-lg bg-[#FFFDF8]`}>
              {/* Header Logos */}
              <div className="flex items-center justify-between mb-4">
                <img
                  src="/apple-touch-icon.png"
                  alt="AlgoMania Emblem"
                  className="w-12 h-12 object-contain"
                />
                <img
                  src="/AlgoMania Interactive Algorithm Lab Logo.png"
                  alt="AlgoMania Wordmark"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <div className="w-12"></div> {/* Balance spacer */}
              </div>

              {/* Certificate Title */}
              <div className="text-center my-4">
                <p className={`text-xs sm:text-sm font-mono font-bold tracking-widest uppercase ${accentColor}`}>
                  {categoryLabel}
                </p>
                <div className={`w-32 h-0.5 mx-auto my-2 bg-gradient-to-r from-transparent via-[#EF592A] to-transparent`}></div>
                <p className="text-[11px] font-sans tracking-wide text-[#69665F] uppercase mt-3">
                  This is proudly presented to
                </p>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#24231F] my-2">
                  {certificate.recipientName}
                </h2>
                <div className="w-48 h-0.5 mx-auto bg-[#28533D]/30 mb-4"></div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-[#4A4740] italic max-w-xl mx-auto leading-relaxed">
                  {isInternship && (
                    <>
                      for successfully completing the rigorous {certificate.duration || '2 Months'} curriculum in{' '}
                      <span className="font-bold font-sans not-italic text-[#28533D]">
                        {certificate.domain || 'Engineering Track'}
                      </span>{' '}
                      with verified algorithmic implementations and mentor defense.
                    </>
                  )}
                  {isBronze && (
                    <>
                      for demonstrating foundational algorithmic excellence by solving{' '}
                      <span className="font-bold font-sans not-italic text-[#8C5028]">
                        {certificate.milestoneCount || 20}+ unique challenges
                      </span>{' '}
                      verified on the AlgoMania Competition Platform.
                    </>
                  )}
                  {isSilver && (
                    <>
                      for distinguished computational problem-solving and algorithmic mastery across{' '}
                      <span className="font-bold font-sans not-italic text-[#4A5568]">
                        {certificate.milestoneCount || 100}+ unique challenges
                      </span>{' '}
                      verified on the AlgoMania Competition Platform.
                    </>
                  )}
                  {isGold && (
                    <>
                      for exemplary computational mastery, exceptional data structure acumen, and solving{' '}
                      <span className="font-bold font-sans not-italic text-[#976E1A]">
                        {certificate.milestoneCount || 200}+ unique challenges
                      </span>{' '}
                      verified on the AlgoMania Competition Platform.
                    </>
                  )}
                </p>
              </div>

              {/* Credential ID and Date Strip */}
              <div className="my-6 p-3 bg-[#FAF7EE] border border-[#E4E9DD] rounded-lg max-w-md mx-auto text-center">
                <p className="text-xs font-mono font-bold text-[#28533D]">
                  {certificate.title}
                </p>
                <p className="text-[11px] font-mono text-[#69665F] mt-1">
                  Issued: {issueDateFormatted} • Credential ID: {certificate.certificateId}
                </p>
              </div>

              {/* Lower Seal & Signature Row */}
              <div className="grid grid-cols-3 items-end pt-6 border-t border-[#DED9CE] mt-6">
                {/* QR Code */}
                <div className="flex flex-col items-start">
                  {qrDataUrl && (
                    <img src={qrDataUrl} alt="QR Code" className="w-16 h-16 rounded border border-[#DED9CE]" />
                  )}
                  <span className="text-[10px] font-mono font-bold text-[#28533D] mt-1">Scan to Verify</span>
                  <span className="text-[9px] font-mono text-[#69665F]">{certificate.certificateId}</span>
                </div>

                {/* Academic Medal Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-16 h-16 rounded-full border-2 ${borderColor} flex flex-col items-center justify-center bg-[#FAF7EE] shadow-xs text-center p-1`}>
                    <span className="text-[7px] font-mono font-bold tracking-tight text-[#28533D]">ALGOMANIA</span>
                    <span className="text-[9px] font-bold text-[#EF592A] uppercase">
                      {isGold ? 'GOLD' : isSilver ? 'SILVER' : isBronze ? 'BRONZE' : 'VERIFIED'}
                    </span>
                    <span className="text-[6px] font-mono text-[#69665F]">OFFICIAL SEAL</span>
                  </div>
                </div>

                {/* Founder Authorization Area */}
                <div className="flex flex-col items-end text-right">
                  <img
                    src="/LakhansingSignature.png"
                    alt="Founder Signature"
                    className="h-10 w-auto object-contain mb-1"
                  />
                  <div className="w-36 h-px bg-[#28533D] mb-1"></div>
                  <span className="text-xs font-bold text-[#24231F]">Lakhansing Patil</span>
                  <span className="text-[10px] font-mono text-[#28533D]">Founder, AlgoMania</span>
                </div>
              </div>

              {/* Verification URL Footer */}
              <div className="text-center mt-6 pt-3 border-t border-[#DED9CE]/60">
                <p className="text-[9px] font-mono text-[#8C887E]">
                  Official validation record securely hosted at: {certificate.verificationUrl}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
