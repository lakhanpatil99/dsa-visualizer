import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import { DEFAULT_INTERNSHIP_PROGRAMS } from '../../lib/internships/internshipData';

// Shared singleton promise to prevent duplicate Razorpay SDK script injection
let razorpaySdkLoadingPromise = null;

function preloadRazorpaySdk() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpaySdkLoadingPromise) return razorpaySdkLoadingPromise;

  razorpaySdkLoadingPromise = new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => {
        razorpaySdkLoadingPromise = null;
        resolve(false);
      });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpaySdkLoadingPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpaySdkLoadingPromise;
}

export default function InternshipApplicationWizard() {
  const { user, getIdToken, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Pre-created order cache & in-flight promise for instant Step 4 checkout opening
  const precreatedOrderRef = useRef(null);
  const precreationPromiseRef = useRef(null);

  // Fast token accessor: defaults to cached token (0ms) rather than forcing STS roundtrip
  const getFreshAuthToken = useCallback(async (forceRefresh = false) => {
    if (typeof getIdToken !== 'function') {
      throw new Error('Authentication is still initializing. Please refresh and sign in again.');
    }
    const token = await getIdToken(forceRefresh);
    if (!token) {
      throw new Error('Your session has expired. Please sign in again.');
    }
    return token;
  }, [getIdToken]);

  // Preload Razorpay SDK script on component mount
  useEffect(() => {
    preloadRazorpaySdk();
  }, []);

  // Wizard Steps:
  // 1: Domain Selection
  // 2: Candidate Details
  // 3: Review Application
  // 4: Order Review & Secure Payment (₹99)
  // 5: Confirmation & Timeline
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [paymentOrderData, setPaymentOrderData] = useState(null);
  const [paymentVerificationResult, setPaymentVerificationResult] = useState(null);
  const [dismissNotice, setDismissNotice] = useState('');

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
    priorExperience: '',
  });

  // Query parameter pre-selection and User profile autofill
  useEffect(() => {
    if (router.query.domain) {
      const qDomain = router.query.domain.toString().toLowerCase();
      if (['java', 'python', 'cpp', 'c++'].includes(qDomain)) {
        setFormData((prev) => ({ ...prev, domain: qDomain === 'c++' ? 'cpp' : qDomain }));
      }
    }
  }, [router.query.domain]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.displayName || user.name || '',
      }));
    }
  }, [user]);

  // Support for resuming an application from dashboard (?resume=APP_ID)
  useEffect(() => {
    async function resumeApplication(appId) {
      if (!user || !appId) return;
      try {
        setLoading(true);
        const token = await getFreshAuthToken();
        const res = await fetch(`/api/payments/status?applicationId=${encodeURIComponent(appId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          if (data.paymentStatus === 'CAPTURED' || data.applicationPaymentStatus === 'PAID_VERIFIED') {
            setSubmittedApplication({ applicationId: appId, domainTitle: 'Engineering Internship' });
            setStep(5);
          } else {
            setSubmittedApplication({
              applicationId: appId,
              domainTitle: 'Engineering Internship',
              fullName: user.name || user.displayName || 'Candidate',
            });
            setStep(4);
          }
        }
      } catch (err) {
        console.error('Failed to resume application:', err);
      } finally {
        setLoading(false);
      }
    }

    if (router.query.resume && isAuthenticated) {
      resumeApplication(router.query.resume.toString());
    }
  }, [router.query.resume, isAuthenticated, user, getFreshAuthToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // Step 3 -> 4: Submit Application Record & Transition to Payment
  const handleSubmitApplication = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/internships/apply');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const token = await getFreshAuthToken();
      const res = await fetch('/api/internships/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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

  // ── Pre-create order in background upon entering Step 4 ────────────
  const precreateOrder = useCallback(async (appId) => {
    if (!appId || precreatedOrderRef.current || precreationPromiseRef.current) return;
    const promise = (async () => {
      try {
        const token = await getFreshAuthToken(false);
        const res = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'x-correlation-id': `pre_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          },
          body: JSON.stringify({ applicationId: appId }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          precreatedOrderRef.current = data;
          setPaymentOrderData(data);
          return data;
        }
      } catch (e) {
        console.warn('[apply] Pre-create order notice:', e.message);
      } finally {
        precreationPromiseRef.current = null;
      }
      return null;
    })();
    precreationPromiseRef.current = promise;
  }, [getFreshAuthToken]);

  useEffect(() => {
    if (step === 4 && submittedApplication?.applicationId) {
      precreateOrder(submittedApplication.applicationId);
    }
  }, [step, submittedApplication, precreateOrder]);

  // ── Step 4: Initiate Razorpay Order & Open Checkout ────────────────
  const handleInitiatePayment = async () => {
    if (paymentLoading || !submittedApplication) return;
    setPaymentLoading(true);
    setErrorMessage('');
    setDismissNotice('');

    const correlationId = `chk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const prepStart = Date.now();

    try {
      // Step A & B in parallel: Ensure SDK is loaded AND order is ready
      const sdkPromise = preloadRazorpaySdk();

      let orderPromise;
      if (precreatedOrderRef.current && precreatedOrderRef.current.applicationId === submittedApplication.applicationId) {
        // Fast-path: order was pre-created in background (0ms!)
        orderPromise = Promise.resolve(precreatedOrderRef.current);
      } else if (precreationPromiseRef.current) {
        // In-flight pre-creation: join existing promise
        orderPromise = precreationPromiseRef.current.then((order) => {
          if (order) return order;
          throw new Error('Pre-creation failed, retrying...');
        }).catch(async () => {
          const token = await getFreshAuthToken(false);
          const res = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              'x-correlation-id': correlationId,
            },
            body: JSON.stringify({ applicationId: submittedApplication.applicationId }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) throw new Error(data.message || 'Failed to initialize payment order.');
          return data;
        });
      } else {
        // Create order directly with 8s bounded timeout
        orderPromise = (async () => {
          const token = await getFreshAuthToken(false);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          try {
            const res = await fetch('/api/payments/create-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-correlation-id': correlationId,
              },
              body: JSON.stringify({ applicationId: submittedApplication.applicationId }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || 'Failed to initialize payment order.');
            return data;
          } catch (fetchErr) {
            clearTimeout(timeoutId);
            if (fetchErr.name === 'AbortError') {
              throw new Error('Order creation timed out. Please click Retry Checkout.');
            }
            throw fetchErr;
          }
        })();
      }

      const [sdkLoaded, orderData] = await Promise.all([sdkPromise, orderPromise]);

      if (!sdkLoaded) {
        throw new Error('Unable to connect to Razorpay payment network. Please check your internet connection.');
      }

      setPaymentOrderData(orderData);
      precreatedOrderRef.current = orderData;

      const totalPrepTimeMs = Date.now() - prepStart;
      console.log(`[apply] Checkout prepared in ${totalPrepTimeMs}ms correlationId=${correlationId}`);

      // Step C: Configure Razorpay Standard Checkout
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount, // in paise: 9900 = ₹99.00
        currency: orderData.currency || 'INR',
        name: 'AlgoMania',
        description: `Internship Registration Fee — ${submittedApplication.domainTitle || 'Fellowship'}`,
        image: '/apple-touch-icon.png',
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: orderData.userName || formData.fullName,
          email: orderData.userEmail || user.email,
          contact: formData.contactNumber || '',
        },
        notes: {
          applicationId: submittedApplication.applicationId,
          domain: formData.domain,
          correlationId,
        },
        theme: {
          color: '#28533D', // AlgoMania Forest Green
        },
        modal: {
          backdropclose: false,
          escape: true,
          handleback: true,
          ondismiss: async function () {
            setPaymentLoading(false);
            setDismissNotice(
              'Checkout window closed. If your payment was completed, click "Check Payment Status" below to verify.'
            );
            // Verify if payment succeeded just as user closed modal
            await checkPaymentStatusSilent(submittedApplication.applicationId);
          },
        },
        handler: async function (response) {
          // Authoritative Server-Side Verification
          await handleVerifyPayment(response);
        },
      };

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on('payment.failed', function (failedResponse) {
        console.warn('Razorpay payment failed:', failedResponse.error);
        setPaymentLoading(false);
        setErrorMessage(
          failedResponse.error?.description ||
          'Payment was declined or failed. Please retry with another payment method.'
        );
      });

      rzpInstance.open();
      // Stop loading once checkout overlay is displayed
      setPaymentLoading(false);
    } catch (err) {
      console.error('Payment initiation error:', err);
      setErrorMessage(err.message || 'Payment initiation encountered an error. Please click Retry Checkout.');
      setPaymentLoading(false);
    }
  };

  // ── Server-Side Payment Verification ────────────────────────────────
  const handleVerifyPayment = async (razorpayResponse) => {
    setPaymentLoading(true);
    setErrorMessage('');
    try {
      const token = await getFreshAuthToken();
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          applicationId: submittedApplication.applicationId,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || 'Server payment verification failed.');
      }

      setPaymentVerificationResult(verifyData.paymentOrder);
      setStep(5);
    } catch (err) {
      console.error('Verification error:', err);
      setErrorMessage(err.message || 'Payment verification failed. Your transaction details have been saved.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // ── Check Payment Status ──────────────────────────────────────────
  const checkPaymentStatus = async () => {
    if (!submittedApplication || !user) return;
    setPaymentLoading(true);
    setErrorMessage('');
    setDismissNotice('');
    try {
      const token = await getFreshAuthToken();
      const res = await fetch(
        `/api/payments/status?applicationId=${encodeURIComponent(submittedApplication.applicationId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) {
        if (data.paymentStatus === 'CAPTURED' || data.verificationStatus === 'FULLY_VERIFIED') {
          setPaymentVerificationResult(data.order);
          setStep(5);
        } else if (data.paymentStatus === 'FAILED') {
          setErrorMessage('Your last payment attempt failed. You can safely try again.');
        } else {
          setDismissNotice('Payment status: ' + data.paymentStatus + '. If you recently paid, please allow a moment.');
        }
      }
    } catch (err) {
      setErrorMessage('Could not retrieve payment status. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const checkPaymentStatusSilent = async (appId) => {
    try {
      const token = await getFreshAuthToken();
      const res = await fetch(`/api/payments/status?applicationId=${encodeURIComponent(appId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && (data.paymentStatus === 'CAPTURED' || data.verificationStatus === 'FULLY_VERIFIED')) {
        setPaymentVerificationResult(data.order);
        setStep(5);
      }
    } catch { }
  };

  const currentProgram =
    DEFAULT_INTERNSHIP_PROGRAMS.find(
      (p) => p.domain.toLowerCase() === formData.domain.replace('cpp', 'c++').toLowerCase()
    ) || DEFAULT_INTERNSHIP_PROGRAMS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>Apply for Engineering Internship — AlgoMania</title>
        <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.razorpay.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://api.razorpay.com" />
      </Head>

      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb & Step Progress */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69665F] dark:text-[#8E8B83] mb-3">
            <Link href="/internships" className="hover:text-[#EF592A]">
              Internships
            </Link>
            <span>/</span>
            <span className="text-[#24231F] dark:text-[#FFFDF8] font-bold">Fellowship Registration</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
            Engineering Internship Application & Registration
          </h1>

          {/* Stepper Pills */}
          <div className="flex items-center space-x-2 mt-4 text-xs font-mono overflow-x-auto pb-1">
            {[
              '1. Domain',
              '2. Details',
              '3. Review',
              '4. Payment (₹99)',
              '5. Confirmed',
            ].map((label, i) => (
              <span
                key={label}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${step === i + 1
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
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-medium animate-fadeIn">
            ⚠️ {errorMessage}
          </div>
        )}

        {dismissNotice && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium animate-fadeIn">
            ℹ️ {dismissNotice}
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
                { id: 'cpp', label: 'C++ Systems', desc: 'Memory models, allocators, low-latency algorithms.' },
              ].map((track) => (
                <div
                  key={track.id}
                  onClick={() => setFormData((prev) => ({ ...prev, domain: track.id }))}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${formData.domain === track.id
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
                className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
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
                className="px-5 py-2.5 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F] hover:text-[#24231F] cursor-pointer"
              >
                ← Back to Domain Selection
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
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
                  <p className="font-bold text-[#28533D] dark:text-[#88C49F] text-sm mt-0.5">
                    {currentProgram.domain} Development
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[#69665F]">Duration:</span>
                  <p className="font-bold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">
                    {formData.duration === '1_month'
                      ? '1 Month'
                      : formData.duration === '2_months'
                        ? '2 Months'
                        : '3 Months'}
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
                  <p className="font-semibold text-[#24231F] dark:text-[#FFFDF8] mt-0.5">
                    {formData.college} ({formData.branch})
                  </p>
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

              {/* Pricing & Checkout Summary Box */}
              <div className="mt-4 p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#28533D]/30 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span className="text-[#24231F] dark:text-[#FFFDF8]">Internship Registration Fee:</span>
                  <span className="font-mono text-[#28533D] dark:text-[#88C49F] text-base">₹99.00</span>
                </div>
                <div className="text-[11px] text-[#69665F] dark:text-[#8E8B83] leading-relaxed">
                  Currency: INR | Payment Gateway: Razorpay Standard Web Checkout.
                  <br />
                  Registration becomes active upon confirmed payment. Verified completion unlock criteria apply.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F] hover:text-[#24231F] cursor-pointer"
              >
                ← Edit Details
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmitApplication}
                className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <span>Saving Application...</span> : <span>Proceed to Registration Fee (₹99) →</span>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER REVIEW & SECURE PAYMENT */}
        {step === 4 && submittedApplication && (
          <div className="space-y-6 animate-fadeIn">
            {/* Sandbox Notice Banner if in test mode */}
            {paymentOrderData?.isTestMode && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex items-center space-x-2">
                <span className="text-base">🧪</span>
                <div>
                  <span className="font-bold uppercase tracking-wider">Sandbox / Test Mode Active:</span>
                  <span className="ml-1">
                    Authorized test credentials are active. Use Razorpay test card / UPI methods for validation.
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#DED9CE] dark:border-[#383630] pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#69665F] dark:text-[#8E8B83]">
                    APPLICATION ID: {submittedApplication.applicationId}
                  </span>
                  <h2 className="text-xl font-bold text-[#24231F] dark:text-[#FFFDF8]">
                    Order Summary & Secure Checkout
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  PENDING PAYMENT
                </span>
              </div>

              {/* Order Itemization Table */}
              <div className="border border-[#DED9CE] dark:border-[#383630] rounded-xl overflow-hidden text-xs">
                <div className="bg-[#FAF8F3] dark:bg-[#1C1B18] px-4 py-3 font-mono font-bold text-[#69665F] dark:text-[#8E8B83] flex justify-between border-b border-[#DED9CE] dark:border-[#383630]">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>
                <div className="px-4 py-3.5 flex justify-between items-center border-b border-[#DED9CE] dark:border-[#383630]">
                  <div>
                    <div className="font-bold text-[#24231F] dark:text-[#FFFDF8]">
                      {submittedApplication.domainTitle || 'Engineering Internship'} Registration
                    </div>
                    <div className="text-[11px] text-[#69665F] dark:text-[#8E8B83] mt-0.5">
                      Fellowship Candidate: {formData.fullName || submittedApplication.fullName}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm">₹99.00</span>
                </div>
                <div className="bg-[#FAF8F3] dark:bg-[#1C1B18] px-4 py-3 flex justify-between items-center font-bold">
                  <span className="text-[#24231F] dark:text-[#FFFDF8]">Total Payable Amount:</span>
                  <span className="font-mono text-base text-[#28533D] dark:text-[#88C49F]">₹99.00 INR</span>
                </div>
              </div>

              {/* Payment Security Assurance */}
              <div className="p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630] text-xs text-[#69665F] dark:text-[#8E8B83] space-y-1.5">
                <div className="font-bold text-[#28533D] dark:text-[#88C49F] flex items-center space-x-1.5">
                  <span>🔒</span>
                  <span>Bank-Grade Encryption & Server Verification</span>
                </div>
                <p className="leading-relaxed">
                  Transactions are processed securely through Razorpay's PCI-DSS compliant infrastructure. All payment
                  signatures and amounts are verified directly by AlgoMania's server before updating your registration.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={paymentLoading}
                    className="px-4 py-2 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F] hover:text-[#24231F] cursor-pointer disabled:opacity-50"
                  >
                    ← Edit Application
                  </button>
                  <button
                    type="button"
                    onClick={checkPaymentStatus}
                    disabled={paymentLoading}
                    className="px-4 py-2 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F] hover:text-[#24231F] cursor-pointer disabled:opacity-50"
                  >
                    Check Status
                  </button>
                </div>

                <button
                  type="button"
                  disabled={paymentLoading}
                  onClick={handleInitiatePayment}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 transition-transform active:scale-95"
                >
                  {paymentLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Preparing Secure Checkout...</span>
                    </>
                  ) : errorMessage ? (
                    <>
                      <span>🔄</span>
                      <span>Retry Checkout (₹99)</span>
                    </>
                  ) : (
                    <>
                      <span>🔒</span>
                      <span>Pay ₹99 Securely</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION & TIMELINE */}
        {step === 5 && submittedApplication && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#28533D] rounded-2xl shadow-md text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#E4E9DD] dark:bg-[#28382F] flex items-center justify-center text-3xl text-[#28533D]">
                ✓
              </div>

              <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#E4E9DD] text-[#28533D]">
                PAYMENT CONFIRMED &bull; APPLICATION ACTIVE
              </span>

              <h2 className="text-2xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
                Registration Confirmed!
              </h2>

              <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] max-w-md mx-auto">
                Your ₹99 registration fee for the{' '}
                <span className="font-bold text-[#28533D]">{submittedApplication.domainTitle || 'Engineering Track'}</span>{' '}
                has been verified and confirmed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
                <div className="p-3 bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630] rounded-xl font-mono text-xs">
                  <span className="text-[#69665F] block text-[10px]">APPLICATION ID:</span>
                  <span className="font-bold text-[#EF592A] text-sm">{submittedApplication.applicationId}</span>
                </div>
                <div className="p-3 bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630] rounded-xl font-mono text-xs">
                  <span className="text-[#69665F] block text-[10px]">PAYMENT STATUS:</span>
                  <span className="font-bold text-[#28533D] dark:text-[#88C49F] text-sm">PAID (₹99.00)</span>
                </div>
              </div>

              {/* Certificate Unlock Rule Notice */}
              <div className="p-4 bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#28533D]/30 rounded-xl max-w-lg mx-auto text-xs text-[#69665F] dark:text-[#A09D95] text-left space-y-1">
                <div className="font-bold text-[#28533D] dark:text-[#88C49F]">
                  📜 Official Certificate Eligibility Criteria
                </div>
                <p>
                  Your registration payment is verified. Your completion certificate will unlock after your internship
                  milestones are completed and verified by academic administration.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
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
                  Browse Other Programs
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
