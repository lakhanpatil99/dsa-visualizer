import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import { DEFAULT_INTERNSHIP_PROGRAMS } from '../../lib/internships/internshipData';
import CertificatePreviewModal from '../../src/components/certificates/CertificatePreviewModal';

export default function InternshipsPortal() {
  const { user, isAuthenticated } = useAuth();
  const [programs, setPrograms] = useState(DEFAULT_INTERNSHIP_PROGRAMS);
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Sample Certificate Preview Modal
  const [sampleModal, setSampleModal] = useState({
    isOpen: false,
    certificate: null
  });

  const openSamplePreview = (domainName = 'Java') => {
    const sampleCert = {
      certificateId: 'SAMPLE-INTERNSHIP-PREVIEW',
      recipientName: user?.displayName || (user?.email ? user.email.split('@')[0] : 'Candidate Engineer'),
      title: `${domainName} Software Engineering Fellowship`,
      domain: domainName,
      duration: '2 Months',
      type: 'internship',
      issueDate: Date.now(),
      verificationUrl: 'https://www.algomania.in/certificates/sample'
    };

    setSampleModal({
      isOpen: true,
      certificate: sampleCert
    });
  };

  const filteredPrograms = selectedDomain === 'all'
    ? programs
    : programs.filter(p => p.domain.toLowerCase() === selectedDomain.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>Engineering Internships & Fellowships — AlgoMania Career Center</title>
        <meta name="description" content="Build engineering skills through structured, mentored practice. Master Java, Python, and C++ software engineering with hands-on algorithm implementations, mentored project sprints, and verified completion credentials." />
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Editorial Hero Header */}
        <div className="relative mb-12 sm:mb-16 pb-8 border-b border-[#DED9CE] dark:border-[#2E2C27]">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#EF592A]"></span>
            <span>AlgoMania Engineering Fellowships</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8] tracking-tight leading-tight max-w-3xl">
            Build engineering skills through structured, mentored practice.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#69665F] dark:text-[#A09D95] max-w-2xl leading-relaxed">
            Bridge the gap between theoretical data structures and production systems. Work through rigorous algorithmic sprints in Java, Python, or C++, receive direct code reviews, and earn tamper-evident completion certificates.
          </p>

          {/* Quick CTA Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/internships/apply"
              className="px-6 py-3 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply for Internship (₹99 Fee) →
            </Link>

            <button
              onClick={() => openSamplePreview('Java')}
              className="px-5 py-3 rounded-xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] text-sm font-semibold text-[#24231F] dark:text-[#FFFDF8] hover:border-[#EF592A] transition-colors flex items-center space-x-2"
            >
              <span>Preview Sample Certificate</span>
              <span className="text-[#EF592A]">↗</span>
            </button>

            {isAuthenticated && (
              <Link
                href="/internships/my-applications"
                className="px-5 py-3 rounded-xl bg-[#E4E9DD]/60 dark:bg-[#28382F]/60 text-sm font-semibold text-[#28533D] dark:text-[#88C49F] hover:bg-[#E4E9DD] transition-colors"
              >
                View My Applications
              </Link>
            )}
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
          {['all', 'java', 'python', 'c++'].map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors ${
                selectedDomain === domain
                  ? 'bg-[#28533D] text-[#FFFDF8]'
                  : 'bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] text-[#69665F] dark:text-[#A09D95] hover:text-[#24231F]'
              }`}
            >
              {domain === 'all' ? 'All Engineering Tracks' : `${domain.toUpperCase()} Track`}
            </button>
          ))}
        </div>

        {/* Program Cards Grid (Balanced 3 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {filteredPrograms.map((program) => (
            <div
              key={program.programId}
              className="bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="p-6 sm:p-8">
                {/* Domain Pill & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD]">
                    {program.domain} Track
                  </span>
                  <span className="text-[11px] font-mono text-[#69665F] dark:text-[#8E8B83]">
                    {program.programFormat}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8] mb-3 leading-snug">
                  {program.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] mb-6 leading-relaxed">
                  {program.shortDescription}
                </p>

                {/* Tech Stack */}
                <div className="mb-6">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#69665F] dark:text-[#8E8B83] mb-2">
                    Core Technologies & Tools
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {program.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#FAF8F3] dark:bg-[#1A1916] border border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#EAE7DF]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Learning Objectives */}
                <div className="mb-6">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#69665F] dark:text-[#8E8B83] mb-2">
                    Curriculum Highlights
                  </div>
                  <ul className="space-y-2">
                    {program.learningObjectives.slice(0, 3).map((obj, idx) => (
                      <li key={idx} className="flex items-start text-xs text-[#4A4740] dark:text-[#C4C0B6]">
                        <span className="text-[#EF592A] mr-2">✓</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fee & Duration Box */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1A1916] border border-[#DED9CE] dark:border-[#383630] text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-[#69665F] dark:text-[#8E8B83]">
                    <span>Registration Fee:</span>
                    <span className="font-mono font-bold text-[#28533D] dark:text-[#88C49F]">₹99 One-Time</span>
                  </div>
                  <div className="flex justify-between items-center text-[#69665F] dark:text-[#8E8B83]">
                    <span>Durations:</span>
                    <span className="font-mono font-bold text-[#24231F] dark:text-[#FFFDF8]">1, 2, or 3 Months</span>
                  </div>
                  <div className="text-[11px] text-[#69665F] dark:text-[#8E8B83] pt-1 border-t border-[#DED9CE]/50">
                    Official certificate unlocked upon verified fee payment and mentor completion review.
                  </div>
                </div>
              </div>

              {/* Card Footer CTAs */}
              <div className="p-6 bg-[#FAF8F3] dark:bg-[#1F1E1B] border-t border-[#DED9CE] dark:border-[#383630] flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href={`/internships/apply?domain=${program.domain.toLowerCase()}`}
                  className="flex-1 w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] shadow-xs transition-transform hover:scale-[1.01]"
                >
                  Apply Now (₹99) →
                </Link>
                <button
                  type="button"
                  onClick={() => openSamplePreview(program.domain)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-[#69665F] hover:text-[#EF592A] transition-colors whitespace-nowrap"
                >
                  Preview Cert ↗
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated "Your Achievement. Officially Recognized." Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EF592A]/15 text-[#EF592A] text-xs font-mono font-bold uppercase tracking-wider">
                <span>VERIFIABLE CREDENTIALS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
                Your Achievement. Officially Recognized.
              </h2>
              <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] leading-relaxed">
                AlgoMania certificates are tamper-evident, cryptographic credentials with immutable public verification URLs and QR inspection. Each credential represents verified algorithmic implementation and code defense.
              </p>

              {/* Invariants & Eligibility Criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1A1916] border border-[#DED9CE] dark:border-[#383630]">
                  <div className="text-xs font-bold text-[#28533D] dark:text-[#88C49F] mb-1">
                    1. Verified Registration Fee
                  </div>
                  <div className="text-[11px] text-[#69665F] dark:text-[#A09D95]">
                    Fixed ₹99 fee calculated and verified server-side via Razorpay webhook signatures.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1A1916] border border-[#DED9CE] dark:border-[#383630]">
                  <div className="text-xs font-bold text-[#28533D] dark:text-[#88C49F] mb-1">
                    2. Mentor Defense & Review
                  </div>
                  <div className="text-[11px] text-[#69665F] dark:text-[#A09D95]">
                    Sprint deliverables verified by administrative engineers before credential issuance.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openSamplePreview('Software Engineering')}
                  className="px-6 py-3 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-xs transition-transform hover:scale-[1.02]"
                >
                  Preview Sample Certificate ↗
                </button>
              </div>
            </div>

            {/* Stylized Visual Parchment Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => openSamplePreview('Software Engineering')}
                className="relative cursor-pointer group p-6 rounded-2xl bg-[#FAF7EE] border-4 border-[#28533D]/60 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-[1.02] max-w-sm w-full"
              >
                {/* Diagonal Watermark Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#EF592A] text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                  SAMPLE PREVIEW
                </div>

                <div className="p-4 border border-dashed border-[#28533D]/40 rounded-xl bg-[#FFFDF8] text-center space-y-2">
                  <img
                    src="/apple-touch-icon.png"
                    alt="AlgoMania Seal"
                    className="w-10 h-10 mx-auto object-contain"
                  />
                  <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#28533D]">
                    CERTIFICATE OF COMPLETION
                  </div>
                  <div className="text-sm font-serif font-bold text-[#24231F]">
                    Candidate Engineer
                  </div>
                  <div className="text-[10px] text-[#69665F] italic">
                    has successfully completed the Engineering Internship Fellowship
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-[#DED9CE]">
                    <div className="text-[8px] font-mono text-[#8C887E]">ID: SAMPLE-PREVIEW</div>
                    <div className="text-[9px] font-bold text-[#EF592A] group-hover:underline">
                      Click to Expand ↗
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Sample Certificate Preview Modal */}
      <CertificatePreviewModal
        isOpen={sampleModal.isOpen}
        certificate={sampleModal.certificate}
        mode="SAMPLE"
        onClose={() => setSampleModal(prev => ({ ...prev, isOpen: false }))}
      />

      <Footer />
    </div>
  );
}
