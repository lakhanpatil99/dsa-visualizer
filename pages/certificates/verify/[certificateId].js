import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../../src/components/Navbar';
import Footer from '../../../src/components/Footer';
import { getPublicCertificateById, normalizeCertificateId } from '../../../lib/certificates/publicVerification.js';

export async function getServerSideProps(context) {
  const rawId = context.params?.certificateId;
  const certificateId = typeof rawId === 'string' ? rawId.trim().slice(0, 96) : '';
  context.res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');

  const normalizedId = normalizeCertificateId(certificateId);
  if (!normalizedId) {
    return { props: { certificateId, verificationStatus: 'INVALID_ID', certificate: null } };
  }

  try {
    const result = await getPublicCertificateById(normalizedId);
    return {
      props: {
        certificateId: normalizedId,
        verificationStatus: result.status,
        certificate: result.certificate
      }
    };
  } catch (error) {
    console.error('[CertificateVerificationPage] Registry lookup unavailable:', error?.message || 'Unknown error');
    return {
      props: {
        certificateId: normalizedId,
        verificationStatus: 'UNAVAILABLE',
        certificate: null
      }
    };
  }
}

function formatDate(value) {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not recorded';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-[#DED9CE] bg-[#FAF8F3] p-4">
      <dt className="text-[10px] font-mono uppercase tracking-wider text-[#777268]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[#24231F] break-words">{value}</dd>
    </div>
  );
}

export default function CertificateVerificationPage({ certificateId, verificationStatus, certificate }) {
  const isValid = verificationStatus === 'VALID' && certificate;
  const isRevoked = verificationStatus === 'REVOKED' && certificate;
  const isUnavailable = verificationStatus === 'UNAVAILABLE';
  const isNotFound = verificationStatus === 'NOT_FOUND' || verificationStatus === 'INVALID_ID';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] text-[#24231F]">
      <Head>
        <title>Verify Credential {certificateId ? `· ${certificateId}` : ''} — AlgoMania</title>
        <meta name="description" content="Public verification record for an AlgoMania internship or algorithmic achievement credential." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E4E9DD] px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#28533D]">
            <span className="h-2 w-2 rounded-full bg-[#EF592A]" />
            AlgoMania · Official Credential Registry
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl font-serif font-bold leading-tight">Certificate verification record</h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#69665F]">
            An independently accessible record of an AlgoMania internship or algorithmic achievement credential.
          </p>
        </div>

        {isValid && (
          <section className="overflow-hidden rounded-3xl border border-[#B9CDBD] bg-[#FFFDF8] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EAF1E9] px-5 sm:px-8 py-5 border-b border-[#D5E1D4]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#28533D] text-2xl font-bold text-white">✓</div>
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#28533D]">Registry status · authentic</p>
                  <h2 className="text-xl font-bold text-[#1E3E2E]">Verified AlgoMania Credential</h2>
                </div>
              </div>
              <span className="inline-flex w-fit rounded-full border border-[#A9C3AE] bg-white px-3 py-1.5 text-xs font-semibold text-[#28533D]">VALID</span>
            </div>

            <div className="p-5 sm:p-8">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#777268]">This credential is issued to</p>
              <h3 className="mt-2 text-2xl sm:text-4xl font-serif font-bold break-words">{certificate.recipientName}</h3>
              <p className="mt-2 text-base sm:text-lg font-semibold text-[#28533D]">{certificate.title}</p>
              {certificate.description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#69665F]">{certificate.description}</p>}

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Detail label="Credential ID" value={certificate.certificateId} />
                <Detail label="Credential type" value={certificate.type?.replace(/_/g, ' ').toUpperCase()} />
                <Detail label="Program / domain" value={certificate.domain || (certificate.tier ? `${certificate.tier} competition tier` : null)} />
                <Detail label="Duration" value={certificate.duration} />
                <Detail label="Verified milestone" value={certificate.milestoneCount ? `${certificate.milestoneCount} unique accepted problems` : null} />
                <Detail label="Issue date" value={formatDate(certificate.issueDate)} />
                <Detail label="Program start" value={formatDate(certificate.startDate)} />
                <Detail label="Completion date" value={formatDate(certificate.endDate)} />
                <Detail label="Issued by" value={certificate.founderTitle || 'Founder, AlgoMania'} />
              </div>

              <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#DED9CE] pt-5">
                <p className="text-xs text-[#777268]">Public verification record. Candidate contact and payment details are not displayed.</p>
                <Link href="/certificates/verify" className="text-sm font-semibold text-[#28533D] hover:text-[#EF592A]">Verify another credential →</Link>
              </div>
            </div>
          </section>
        )}

        {isRevoked && (
          <section className="rounded-3xl border border-red-300 bg-[#FFFDF8] overflow-hidden">
            <div className="flex items-center gap-3 bg-red-50 px-5 sm:px-8 py-6 border-b border-red-200">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-700 text-2xl font-bold text-white">!</div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-700">Registry status</p>
                <h2 className="text-xl sm:text-2xl font-bold text-red-800">Certificate revoked</h2>
              </div>
            </div>
            <div className="p-5 sm:p-8 space-y-3">
              <p className="text-sm text-[#69665F]">Credential <strong className="font-mono text-[#24231F]">{certificate.certificateId}</strong> is no longer valid.</p>
              {certificate.revokedReason && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">Public reason: {certificate.revokedReason}</p>}
              <p className="text-xs text-[#777268]">Revoked on {formatDate(certificate.revokedAt)}.</p>
            </div>
          </section>
        )}

        {(isNotFound || isUnavailable) && (
          <section className="rounded-3xl border border-[#DED9CE] bg-[#FFFDF8] p-6 sm:p-10 text-center shadow-sm">
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${isUnavailable ? 'bg-amber-100 text-amber-800' : 'bg-[#F2EDE2] text-[#777268]'}`}>
              {isUnavailable ? '…' : '?'}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">{isUnavailable ? 'Verification temporarily unavailable' : 'Credential not found'}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#69665F]">
              {isUnavailable
                ? 'The official registry could not be reached. This does not mean the credential is invalid. Please retry in a moment.'
                : verificationStatus === 'INVALID_ID'
                  ? 'Check the credential reference and try again.'
                  : 'No matching issued credential was found in the AlgoMania registry. Check the ID printed on the certificate.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/certificates/verify" className="rounded-xl bg-[#28533D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1F4230]">Try another ID</Link>
              <Link href={`/certificates/verify/${encodeURIComponent(certificateId)}`} className="rounded-xl border border-[#DED9CE] px-5 py-3 text-sm font-semibold text-[#24231F] hover:border-[#EF592A]">Retry verification</Link>
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-[#777268]">Need help? Visit the <Link href="/internships" className="font-semibold text-[#28533D] hover:text-[#EF592A]">AlgoMania program centre</Link>.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
