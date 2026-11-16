import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import { DEFAULT_INTERNSHIP_PROGRAMS } from '../../lib/internships/internshipData';

export default function InternshipsPortal() {
  const { isAuthenticated } = useAuth();
  const [programs, setPrograms] = useState(DEFAULT_INTERNSHIP_PROGRAMS);
  const [selectedDomain, setSelectedDomain] = useState('all');

  const filteredPrograms = selectedDomain === 'all'
    ? programs
    : programs.filter(p => p.domain.toLowerCase() === selectedDomain.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>Engineering Internships — AlgoMania Career Center</title>
        <meta name="description" content="Master Java, Python, and C++ software engineering with hands-on algorithm implementations, mentored project sprints, and verified completion credentials." />
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
            Mentored Software Engineering Internships.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#69665F] dark:text-[#A09D95] max-w-2xl leading-relaxed">
            Bridge the gap between theoretical data structures and production systems. Work through structured algorithmic sprints in Java, Python, or C++, receive code reviews, and earn tamper-evident completion certificates.
          </p>

          {/* Quick CTA Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/internships/apply"
              className="px-6 py-3 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply for Internship →
            </Link>

            {isAuthenticated && (
              <Link
                href="/internships/my-applications"
                className="px-5 py-3 rounded-xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] text-sm font-semibold text-[#24231F] dark:text-[#FFFDF8] hover:border-[#EF592A] transition-colors"
              >
                View My Applications
              </Link>
            )}

            <Link
              href="/certificates"
              className="px-5 py-3 rounded-xl text-sm font-semibold text-[#69665F] dark:text-[#A09D95] hover:text-[#28533D] dark:hover:text-[#FFFDF8] transition-colors"
            >
              Certification Standards & Credentials
            </Link>
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

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => (
            <div
              key={program.programId}
              className="bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="p-6 sm:p-8">
                {/* Domain Pill & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD]">
                    {program.domain} Development
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

                {/* Duration & Eligibility Box */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1A1916] border border-[#DED9CE] dark:border-[#383630] text-xs space-y-1.5">
                  <div className="flex justify-between text-[#69665F] dark:text-[#8E8B83]">
                    <span>Durations:</span>
                    <span className="font-mono font-bold text-[#24231F] dark:text-[#FFFDF8]">1, 2, or 3 Months</span>
                  </div>
                  <div className="text-[11px] text-[#69665F] dark:text-[#8E8B83]">
                    {program.certificateEligibility}
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-6 bg-[#FAF8F3] dark:bg-[#1F1E1B] border-t border-[#DED9CE] dark:border-[#383630]">
                <Link
                  href={`/internships/apply?domain=${program.domain.toLowerCase()}`}
                  className="w-full block py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] shadow-xs transition-transform hover:scale-[1.01]"
                >
                  Apply for {program.domain} Track →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
