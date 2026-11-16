import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../../src/components/Navbar';
import Footer from '../../../src/components/Footer';

export async function getServerSideProps(context) {
  const { certificateId } = context.params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/certificates/verify/${certificateId}`);
    const data = await res.json();

    return {
      props: {
        certificateId,
        isValid: data.success && data.certificate?.status === 'VALID',
        isRevoked: data.certificate?.status === 'REVOKED',
        certificate: data.certificate || null,
        error: !data.success ? data.message : null
      }
    };
  } catch (err) {
    return {
      props: {
        certificateId,
        isValid: false,
        isRevoked: false,
        certificate: null,
        error: 'Unable to reach verification verification authority.'
      }
    };
  }
}

export default function CertificateVerificationPage({
  certificateId,
  isValid,
  isRevoked,
  certificate,
  error
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>Credential Verification: {certificateId} — AlgoMania Official Registry</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <span>🛡️</span>
            <span>AlgoMania Credential Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
            Official Certificate Verification Record
          </h1>
          <p className="text-xs font-mono text-[#69665F] mt-1">
            Credential Reference: {certificateId}
          </p>
        </div>

        {/* VALID RECORD */}
        {isValid && certificate && (
          <div className="p-8 sm:p-10 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border-2 border-[#28533D] shadow-lg space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DED9CE] dark:border-[#383630] gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Official Status: Authentic & Verified
                  </span>
                  <h2 className="text-lg font-bold text-[#24231F] dark:text-[#FFFDF8]">
                    Valid AlgoMania Credential
                  </h2>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-[#69665F]">
                Issued: {new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* Recipient and Title */}
            <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630] space-y-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#69665F]">Recipient Name:</span>
                <p className="text-xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">
                  {certificate.recipientName}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#69665F]">Program / Achievement:</span>
                <p className="text-sm font-bold text-[#28533D] dark:text-[#88C49F] mt-0.5">
                  {certificate.title}
                </p>
                <p className="text-xs text-[#4A4740] dark:text-[#C4C0B6] mt-1 leading-relaxed">
                  {certificate.description}
                </p>
              </div>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630]">
                <span className="text-[#69665F] text-[10px]">Type:</span>
                <p className="font-bold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">
                  {certificate.type.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630]">
                <span className="text-[#69665F] text-[10px]">Authorization:</span>
                <p className="font-bold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">
                  {certificate.founderTitle}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630] col-span-2 sm:col-span-1">
                <span className="text-[#69665F] text-[10px]">Registry:</span>
                <p className="font-bold text-[#28533D] dark:text-[#88C49F] mt-0.5">
                  AlgoMania Verified ✓
                </p>
              </div>
            </div>

            {/* Privacy Protection Notice */}
            <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1C1B18] text-[11px] text-[#69665F] dark:text-[#8E8B83] text-center border border-[#DED9CE] dark:border-[#383630]">
              🔒 For data privacy protection, candidate contact details, email addresses, and payment records are omitted from public registry verification.
            </div>
          </div>
        )}

        {/* REVOKED RECORD */}
        {isRevoked && (
          <div className="p-8 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-500 shadow-md space-y-4 text-center animate-fadeIn">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-200 dark:bg-red-900/60 text-red-700 dark:text-red-300 flex items-center justify-center text-2xl font-bold">
              ✕
            </div>
            <h2 className="text-xl font-bold text-red-800 dark:text-red-300">
              Certificate Revoked
            </h2>
            <p className="text-xs text-red-700 dark:text-red-400 max-w-md mx-auto">
              Credential ID <span className="font-mono font-bold">{certificateId}</span> has been formally revoked by the AlgoMania administrative authority.
            </p>
            {certificate?.revokedReason && (
              <p className="text-xs font-mono text-red-800 dark:text-red-300 p-2 bg-red-100 dark:bg-red-900/40 rounded-lg inline-block">
                Reason: {certificate.revokedReason}
              </p>
            )}
          </div>
        )}

        {/* NOT FOUND / INVALID RECORD */}
        {!isValid && !isRevoked && (
          <div className="p-8 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] shadow-sm space-y-4 text-center animate-fadeIn">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-[#24231F] dark:text-[#FFFDF8]">
              Credential Not Found
            </h2>
            <p className="text-xs text-[#69665F] dark:text-[#A09D95] max-w-md mx-auto">
              The credential ID <span className="font-mono font-bold text-[#EF592A]">{certificateId}</span> could not be verified in the authoritative AlgoMania registry. Please verify the ID for typographical errors.
            </p>
            <div className="pt-2">
              <Link
                href="/certificates"
                className="px-5 py-2.5 rounded-xl bg-[#28533D] text-[#FFFDF8] text-xs font-semibold"
              >
                Go to Certificate Library
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
