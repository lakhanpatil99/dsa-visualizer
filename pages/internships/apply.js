import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import { DEFAULT_INTERNSHIP_PROGRAMS } from '../../lib/internships/internshipData';

export default function InternshipApplicationWizard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Wizard Steps: 1: Domain, 2: Details, 3: Review, 4: Confirmed
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedApplication, setSubmittedApplication] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    domain: 'java',
    fullName: '',
    contactNumber: '',
    college: '',
    branch: '',
    academicYear: '3rd Year',
    duration: '2_months',
    preferredStartDate: '',
    learningObjectives: '',
    priorExperience: ''
  });

  // Query parameter pre-selection and User profile autofill
  useEffect(() => {
    if (router.query.domain) {
      const qDomain = router.query.domain.toString().toLowerCase();
      if (['java', 'python', 'cpp', 'c++'].includes(qDomain)) {
        setFormData(prev => ({ ...prev, domain: qDomain === 'c++' ? 'cpp' : qDomain }));
      }
    }
  }, [router.query.domain]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.displayName || user.name || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleNextToReview = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!formData.contactNumber.trim() || formData.contactNumber.length < 8) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }
    if (!formData.college.trim()) {
      setErrorMessage('College or institution name is required.');
      return;
    }
    if (!formData.branch.trim()) {
      setErrorMessage('Academic branch or degree major is required.');
      return;
    }
    if (!formData.preferredStartDate) {
      setErrorMessage('Please select a preferred start date.');
      return;
    }
    if (!formData.learningObjectives.trim() || formData.learningObjectives.length < 10) {
      setErrorMessage('Please provide a brief summary of your learning objectives (minimum 10 characters).');
      return;
    }

    setStep(3);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/internships/apply');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/internships/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Application submission failed.');
      }

      setSubmittedApplication(data.application);
      setStep(4);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentProgram = DEFAULT_INTERNSHIP_PROGRAMS.find(
    p => p.domain.toLowerCase() === formData.domain.replace('cpp', 'c++').toLowerCase()
  ) || DEFAULT_INTERNSHIP_PROGRAMS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>Apply for Engineering Internship — AlgoMania</title>
      </Head>

      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb & Step Progress */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69665F] dark:text-[#8E8B83] mb-3">
            <Link href="/internships" className="hover:text-[#EF592A]">Internships</Link>
            <span>/</span>
            <span className="text-[#24231F] dark:text-[#FFFDF8] font-bold">Fellowship Application</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
            Engineering Internship Application
          </h1>

          {/* Stepper Pills */}
          <div className="flex items-center space-x-2 mt-4 text-xs font-mono">
            {['1. Select Domain', '2. Candidate Details', '3. Review Application', '4. Confirmation'].map((label, i) => (
              <span
                key={label}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  step === i + 1
                    ? 'bg-[#28533D] text-[#FFFDF8]'
                    : step > i + 1
                    ? 'bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD]'
                    : 'bg-[#FAF8F3] dark:bg-[#24231F] text-[#8E8B83]'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* STEP 1: DOMAIN SELECTION */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-[#24231F] dark:text-[#FFFDF8]">
              Step 1: Choose Your Engineering Track
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'java', label: 'Java Development', desc: 'Enterprise algorithms, Spring Boot, multithreading.' },
                { id: 'python', label: 'Python Systems', desc: 'AsyncIO, computational data engines, APIs.' },
                { id: 'cpp', label: 'C++ Systems', desc: 'Memory models, allocators, low-latency algorithms.' }
              ].map(track => (
                <div
                  key={track.id}
                  onClick={() => setFormData(prev => ({ ...prev, domain: track.id }))}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    formData.domain === track.id
                      ? 'border-[#28533D] bg-[#E4E9DD]/40 dark:bg-[#28382F]/40 shadow-sm ring-2 ring-[#28533D]'
                      : 'border-[#DED9CE] dark:border-[#383630] bg-[#FFFDF8] dark:bg-[#24231F] hover:border-[#EF592A]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#24231F] dark:text-[#FFFDF8]">{track.label}</span>
                    <input
                      type="radio"
                      name="domain"
                      value={track.id}
                      checked={formData.domain === track.id}
                      onChange={handleChange}
                      className="text-[#28533D]"
                    />
                  </div>
                  <p className="text-xs text-[#69665F] dark:text-[#A09D95] leading-relaxed">{track.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-xs"
              >
                Continue to Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ENTER DETAILS */}
        {step === 2 && (
          <form onSubmit={handleNextToReview} className="space-y-6 animate-fadeIn">
            <div className="p-6 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#24231F] dark:text-[#FFFDF8] border-b border-[#DED9CE] dark:border-[#383630] pb-2">
                Candidate Information ({currentProgram.domain} Track)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#28533D]"
                    placeholder="e.g. Lakhansing Patil"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#28533D]"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    College / University / Institution *
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#28533D]"
                    placeholder="e.g. National Institute of Technology"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    Academic Branch / Major *
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#28533D]"
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    Academic Year *
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#28533D]"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Postgraduate">Postgraduate (Masters / PhD)</option>
                    <option value="Graduate">Recent Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    Preferred Fellowship Duration *
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#28533D]"
                  >
                    <option value="1_month">1 Month (Intensive Sprint)</option>
                    <option value="2_months">2 Months (Standard Fellowship)</option>
                    <option value="3_months">3 Months (Comprehensive Master Track)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    Preferred Start Date *
                  </label>
                  <input
                    type="date"
                    name="preferredStartDate"
                    value={formData.preferredStartDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#28533D]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    Learning Objectives & Program Goals *
                  </label>
                  <textarea
                    rows={3}
                    name="learningObjectives"
                    value={formData.learningObjectives}
                    onChange={handleChange}
                    required
                    placeholder="Describe what algorithms or backend architectural competencies you intend to master during this fellowship..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#28533D]"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    Relevant Prior Technical Experience (Optional)
                  </label>
                  <input
                    type="text"
                    name="priorExperience"
                    value={formData.priorExperience}
                    onChange={handleChange}
                    placeholder="e.g. Built a RESTful API, completed DSA course on AlgoMania, GitHub profile link..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#28533D]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F] hover:text-[#24231F]"
              >
                ← Back to Domain Selection
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-xs"
              >
                Review Application →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: APPLICATION REVIEW */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#24231F] dark:text-[#FFFDF8] border-b border-[#DED9CE] dark:border-[#383630] pb-2">
                Review Application Summary
              </h2>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-mono text-[#69665F]">Domain Track:</span>
                  <p className="font-bold text-[#28533D] dark:text-[#88C49F] text-sm mt-0.5">{currentProgram.domain} Development</p>
                </div>
                <div>
                  <span className="font-mono text-[#69665F]">Duration:</span>
                  <p className="font-bold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">
                    {formData.duration === '1_month' ? '1 Month' : formData.duration === '2_months' ? '2 Months' : '3 Months'}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[#69665F]">Candidate Name:</span>
                  <p className="font-semibold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">{formData.fullName}</p>
                </div>
                <div>
                  <span className="font-mono text-[#69665F]">Contact Phone:</span>
                  <p className="font-semibold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">{formData.contactNumber}</p>
                </div>
                <div>
                  <span className="font-mono text-[#69665F]">College / Branch:</span>
                  <p className="font-semibold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">{formData.college} ({formData.branch})</p>
                </div>
                <div>
                  <span className="font-mono text-[#69665F]">Academic Standing:</span>
                  <p className="font-semibold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">{formData.academicYear}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-[#69665F]">Preferred Start Date:</span>
                  <p className="font-semibold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">{formData.preferredStartDate}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-[#69665F]">Learning Objectives:</span>
                  <p className="text-[#4A4740] dark:text-[#C4C0B6] mt-0.5 italic">{formData.learningObjectives}</p>
                </div>
              </div>

              {/* Payment Architecture Note */}
              <div className="mt-4 p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630] text-xs text-[#69665F] dark:text-[#8E8B83] space-y-1">
                <div className="font-bold text-[#28533D] dark:text-[#88C49F]">
                  ℹ️ Certificate & Fee Processing Information
                </div>
                <p>
                  Application review and program registration are processed free of charge. Nominal certificate fee processing is currently pending Razorpay gateway activation and will only be collected upon verified program completion.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F] hover:text-[#24231F]"
              >
                ← Edit Details
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-xs flex items-center space-x-2"
              >
                {loading ? (
                  <span>Submitting Application...</span>
                ) : (
                  <span>Confirm & Submit Application ✓</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION & TIMELINE */}
        {step === 4 && submittedApplication && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#28533D] rounded-2xl shadow-md text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#E4E9DD] dark:bg-[#28382F] flex items-center justify-center text-2xl text-[#28533D]">
                ✓
              </div>

              <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#E4E9DD] text-[#28533D]">
                STATUS: PENDING REVIEW
              </span>

              <h2 className="text-2xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
                Application Successfully Submitted!
              </h2>

              <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] max-w-md mx-auto">
                Your application for the <span className="font-bold text-[#28533D]">{submittedApplication.domainTitle}</span> has been assigned reference ID:
              </p>

              <div className="p-3 bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630] rounded-xl font-mono text-sm font-bold text-[#EF592A] max-w-xs mx-auto">
                {submittedApplication.applicationId}
              </div>

              <p className="text-xs text-[#69665F] dark:text-[#A09D95] max-w-lg mx-auto">
                Our academic review committee verifies engineering credentials within 2 business days. You can track your application milestone progression, mentor assignments, and completion criteria from your dashboard.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/internships/my-applications"
                  className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider"
                >
                  View My Applications Tracker →
                </Link>
                <Link
                  href="/internships"
                  className="px-5 py-2.5 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F]"
                >
                  Back to Programs
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
