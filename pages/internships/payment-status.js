import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';

export default function PaymentStatusPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { applicationId } = router.query;

  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');
  const [pollCount, setPollCount] = useState(0);
  const pollTimerRef = useRef(null);

  const fetchStatus = async () => {
    if (!user || !applicationId) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/payments/status?applicationId=${encodeURIComponent(applicationId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStatusData(data);
        setError('');
      } else {
        setError(data.message || 'Failed to retrieve payment status.');
      }
    } catch (err) {
      setError('Network communication failure while verifying payment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && applicationId) {
      fetchStatus();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, applicationId, authLoading]);

  // Bounded auto-polling: if status is PENDING, poll every 3 seconds, up to 5 times
  useEffect(() => {
    if (statusData && statusData.paymentStatus === 'PENDING' && pollCount < 5) {
      pollTimerRef.current = setTimeout(() => {
        setPollCount((prev) => prev + 1);
        fetchStatus();
      }, 3000);
    }
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [statusData, pollCount]);

  const renderStatusCard = () => {
    if (!statusData) return null;

    const status = statusData.paymentStatus;
    const isCaptured = status === 'CAPTURED' || status === 'PAID_VERIFIED';
    const isFailed = status === 'FAILED' || status === 'CANCELLED';
    const isPending = status === 'PENDING' || status === 'PENDING_PAYMENT' || status === 'CREATED';

    if (isCaptured) {
      return (
        <div className="p-8 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#28533D] rounded-2xl shadow-md text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E4E9DD] dark:bg-[#28382F] flex items-center justify-center text-3xl text-[#28533D]">
            ✓
          </div>
          <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#E4E9DD] text-[#28533D]">
            PAYMENT VERIFIED
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
            Payment Successful!
          </h2>
          <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] max-w-md mx-auto">
            Your ₹99.00 registration fee for application{' '}
            <span className="font-mono font-bold text-[#EF592A]">{applicationId}</span> is confirmed.
          </p>
          {statusData.order && (
            <div className="p-4 bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630] rounded-xl text-left text-xs font-mono space-y-1.5 max-w-md mx-auto">
              <div>
                <span className="text-[#69665F]">Order ID: </span>
                <span className="font-bold">{statusData.order.orderId}</span>
              </div>
              {statusData.order.razorpayPaymentId && (
                <div>
                  <span className="text-[#69665F]">Payment ID: </span>
                  <span className="font-bold">{statusData.order.razorpayPaymentId}</span>
                </div>
              )}
              <div>
                <span className="text-[#69665F]">Amount Paid: </span>
                <span className="font-bold text-[#28533D] dark:text-[#88C49F]">₹99.00 INR</span>
              </div>
            </div>
          )}
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/internships/my-applications"
              className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider"
            >
              Go to My Applications →
            </Link>
          </div>
        </div>
      );
    }

    if (isFailed) {
      return (
        <div className="p-8 bg-[#FFFDF8] dark:bg-[#24231F] border border-red-300 dark:border-red-800 rounded-2xl shadow-md text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-3xl text-red-600">
            ✕
          </div>
          <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-red-100 text-red-800">
            PAYMENT NOT COMPLETED
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
            Payment Failed or Cancelled
          </h2>
          <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] max-w-md mx-auto">
            Your application details are completely safe. The ₹99 registration transaction was not completed.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href={`/internships/apply?resume=${applicationId}`}
              className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider"
            >
              Retry Payment Now →
            </Link>
            <Link
              href="/internships/my-applications"
              className="px-5 py-2.5 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F]"
            >
              Return to Applications
            </Link>
          </div>
        </div>
      );
    }

    // Pending / Processing state
    return (
      <div className="p-8 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-md text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-2xl text-amber-600 animate-pulse">
          ⏳
        </div>
        <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-100 text-amber-800">
          STATUS: {status}
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
          Checking Payment Confirmation
        </h2>
        <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] max-w-md mx-auto">
          We are confirming your transaction with the payment gateway. If you completed payment via UPI or net banking,
          it may take a few moments to reconcile.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={fetchStatus}
            className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Refresh Status Now ↻
          </button>
          <Link
            href={`/internships/apply?resume=${applicationId}`}
            className="px-5 py-2.5 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F]"
          >
            Proceed to Checkout →
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>Payment Status — AlgoMania</title>
      </Head>

      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#69665F] dark:text-[#8E8B83] mb-2">
            <Link href="/internships" className="hover:text-[#EF592A]">
              Internships
            </Link>
            <span>/</span>
            <Link href="/internships/my-applications" className="hover:text-[#EF592A]">
              Applications
            </Link>
            <span>/</span>
            <span className="text-[#24231F] dark:text-[#FFFDF8] font-bold">Payment Status</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-800 dark:text-red-300 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#69665F]">
            Retrieving payment records...
          </div>
        ) : (
          renderStatusCard()
        )}
      </main>

      <Footer />
    </div>
  );
}
