import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../../src/components/Navbar';
import Footer from '../../../src/components/Footer';

export async function getServerSideProps({ query }) {
  const value = typeof query.id === 'string' ? query.id.trim() : '';
  if (value) {
    return {
      redirect: {
        destination: `/certificates/verify/${encodeURIComponent(value.slice(0, 96))}`,
        permanent: false
      }
    };
  }
  return { props: {} };
}

export default function PublicCertificateSearch() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] text-[#24231F]">
      <Head>
        <title>Verify a Certificate — AlgoMania</title>
        <meta name="description" content="Verify the authenticity of an AlgoMania internship or algorithmic achievement certificate. No account required." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E4E9DD] px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#28533D]">
            <span className="h-2 w-2 rounded-full bg-[#EF592A]" />
            Public registry · no sign-in required
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-serif font-bold leading-tight">Verify an AlgoMania credential</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-lg leading-relaxed text-[#69665F]">
            Confirm the authenticity of an internship or algorithmic achievement certificate using its unique credential reference.
          </p>
        </div>

        <section className="mx-auto mt-9 max-w-2xl rounded-3xl border border-[#DED9CE] bg-[#FFFDF8] p-5 sm:p-8 shadow-sm">
          <form action="/certificates/verify" method="GET" className="space-y-4">
            <label htmlFor="certificate-id" className="block text-xs font-mono font-bold uppercase tracking-widest text-[#69665F]">Certificate ID</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="certificate-id"
                name="id"
                type="text"
                required
                minLength={3}
                maxLength={96}
                autoComplete="off"
                spellCheck="false"
                placeholder="e.g. ALG-INT-2026-..."
                className="min-w-0 flex-1 rounded-xl border border-[#CFC9BC] bg-white px-4 py-3.5 text-sm font-mono uppercase text-[#24231F] outline-none transition focus:border-[#28533D] focus:ring-2 focus:ring-[#28533D]/15"
              />
              <button type="submit" className="rounded-xl bg-[#28533D] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1F4230] focus:outline-none focus:ring-2 focus:ring-[#28533D]/30">
                Verify credential →
              </button>
            </div>
            <p className="text-xs leading-relaxed text-[#777268]">Enter the unique Credential ID printed on the certificate, or scan its QR code with your phone camera.</p>
          </form>
        </section>

        <div className="mx-auto mt-7 grid max-w-2xl grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#DED9CE] bg-[#FAF8F3] p-4">
            <p className="text-sm font-semibold text-[#28533D]">Internship credentials</p>
            <p className="mt-1 text-xs leading-relaxed text-[#69665F]">Java, Python and C++ engineering internship completion records.</p>
          </div>
          <div className="rounded-2xl border border-[#DED9CE] bg-[#FAF8F3] p-4">
            <p className="text-sm font-semibold text-[#28533D]">Competition credentials</p>
            <p className="mt-1 text-xs leading-relaxed text-[#69665F]">Official Bronze, Silver and Gold algorithmic achievement records.</p>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] leading-relaxed text-[#888276]">
          Public verification displays only credential details required to confirm authenticity. Contact information, account identifiers and payment records remain private.
        </p>
        <div className="mt-7 text-center"><Link href="/" className="text-xs font-semibold text-[#28533D] hover:text-[#EF592A]">← Return to AlgoMania</Link></div>
      </main>
      <Footer />
    </div>
  );
}
