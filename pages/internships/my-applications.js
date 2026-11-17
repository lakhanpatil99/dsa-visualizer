import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';

export default function MyApplications() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingAppId, setCheckingAppId] = useState(null);
  const [statusNotice, setStatusNotice] = useState({});
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = useCallback(async ({ silent = false } = {}) => {
    if (!user) return;
    if (!silent) setLoading(true);
    setRefreshing(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/internships/my-applications', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load applications.');
      }

      setApplications(data.applications || []);
      setError('');
      setLastSyncedAt(new Date().toISOString());
    } catch (err) {
      setError(err.message || 'Network error while retrieving applications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (!authLoading) setLoading(false);
      return undefined;
    }

    fetchApplications();
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') fetchApplications({ silent: true });
    };
    const interval = setInterval(refreshIfVisible, 12000);
    window.addEventListener('focus', refreshIfVisible);
    document.addEventListener('visibilitychange', refreshIfVisible);
    window.addEventListener('online', refreshIfVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refreshIfVisible);
      document.removeEventListener('visibilitychange', refreshIfVisible);
      window.removeEventListener('online', refreshIfVisible);
    };
  }, [fetchApplications, isAuthenticated, authLoading]);

  const handleCheckPaymentStatus = async (appId) => {
    setCheckingAppId(appId);
    setStatusNotice((prev) => ({ ...prev, [appId]: 'Checking payment status...' }));
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/payments/status?applicationId=${encodeURIComponent(appId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStatusNotice((prev) => ({
          ...prev,
          [appId]: `Current status: ${data.paymentStatus || 'PENDING_PAYMENT'}`,
        }));
        // Refresh application list to reflect any changes
        fetchApplications();
      } else {
        setStatusNotice((prev) => ({ ...prev, [appId]: data.message || 'Could not verify.' }));
      }
    } catch (err) {
      setStatusNotice((prev) => ({ ...prev, [appId]: 'Failed to reach payment service.' }));
    } finally {
      setCheckingAppId(null);
    }
  };

  const downloadOfficialCertificate = async (certificate) => {
    if (!user || !certificate?.certificateId || certificate.status !== 'VALID') return;
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/certificates/download/${encodeURIComponent(certificate.certificateId)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Certificate PDF is not available.');
      }
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `${certificate.certificateId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      setStatusNotice((prev) => ({ ...prev, download: error.message || 'Unable to download certificate.' }));
    }
  };

  const shareOfficialCertificate = async (certificate) => {
    if (!certificate?.certificateId) return;
    const url = certificate.verificationUrl ||
      `https://www.algomania.in/certificates/verify/${certificate.certificateId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: certificate.title || 'AlgoMania Internship Certificate',
          text: `Verify my AlgoMania internship credential: ${certificate.certificateId}`,
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setStatusNotice((prev) => ({ ...prev, share: 'Official verification link copied.' }));
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url);
          setStatusNotice((prev) => ({ ...prev, share: 'Official verification link copied.' }));
        } catch {
          window.prompt('Copy the official verification link:', url);
        }
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING_REVIEW: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
      APPROVED: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
      IN_PROGRESS: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
      COMPLETED: 'bg-[#28533D] text-[#FFFDF8]',
      REJECTED: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300',
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${styles[status] || styles.PENDING_REVIEW}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'PAID_VERIFIED') {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#88C49F] border border-[#28533D]/30">
          ✓ Paid (₹99)
        </span>
      );
    }
    if (status === 'FAILED') {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200">
          Payment Failed
        </span>
      );
    }
    if (status === 'REFUNDED') {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
          Refunded
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300">
        Fee Pending (₹99)
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>My Internship Applications — AlgoMania</title>
      </Head>

      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 border-b border-[#DED9CE] dark:border-[#2E2C27] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#69665F] dark:text-[#8E8B83] mb-2">
              <Link href="/internships" className="hover:text-[#EF592A]">
                Internships
              </Link>
              <span>/</span>
              <span className="text-[#24231F] dark:text-[#FFFDF8] font-bold">Applications Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
              My Fellowship Applications & Milestones
            </h1>
            <p className="mt-2 text-[10px] font-mono text-[#8E8B83]">
              {lastSyncedAt ? `Live status sync · ${new Date(lastSyncedAt).toLocaleTimeString()}` : 'Syncing application and certificate status'}
              <button type="button" onClick={() => fetchApplications()} disabled={refreshing} className="ml-3 font-bold text-[#28533D] underline disabled:opacity-50">
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </p>
          </div>

          <Link
            href="/internships/apply"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-semibold shadow-xs"
          >
            + Apply for New Track
          </Link>
        </div>

        {!isAuthenticated && !authLoading && (
          <div className="p-8 text-center rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630]">
            <p className="text-sm text-[#69665F] dark:text-[#8E8B83] mb-4">
              Please sign in to view your applications and credential progress.
            </p>
            <Link
              href="/login?redirect=/internships/my-applications"
              className="px-6 py-2.5 rounded-xl bg-[#28533D] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider"
            >
              Sign In to AlgoMania
            </Link>
          </div>
        )}

        {loading && (
          <div className="py-16 text-center text-xs font-mono text-[#69665F]">
            Loading application records...
          </div>
        )}

        {!loading && isAuthenticated && applications.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] space-y-4">
            <div className="text-3xl">📁</div>
            <h3 className="text-base font-bold text-[#24231F] dark:text-[#FFFDF8]">No Applications Found</h3>
            <p className="text-xs text-[#69665F] dark:text-[#8E8B83] max-w-sm mx-auto">
              You have not applied for any engineering internships yet. Choose between Java, Python, or C++ tracks.
            </p>
            <Link
              href="/internships/apply"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#28533D] text-[#FFFDF8] text-xs font-semibold shadow-xs"
            >
              Start Fellowship Application
            </Link>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.applicationId}
                className="p-6 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-xs space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DED9CE] dark:border-[#383630] pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#69665F] dark:text-[#8E8B83]">
                      APP ID: {app.applicationId}
                    </span>
                    <h3 className="text-lg font-bold text-[#24231F] dark:text-[#FFFDF8]">
                      {app.domainTitle} ({app.duration.replace('_', ' ')})
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPaymentStatusBadge(app.paymentStatus)}
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Timeline Progress Stepper */}
                <div className="py-2">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#69665F] dark:text-[#8E8B83] mb-3">
                    Progress Timeline
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        title: '1. Applied',
                        done: true,
                        date: new Date(app.appliedAt || app.createdAt).toLocaleDateString(),
                      },
                      {
                        title: '2. Review & Approval',
                        done: ['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(app.status),
                        date: app.status === 'PENDING_REVIEW' ? 'Pending Review' : 'Verified',
                      },
                      {
                        title: '3. Sprint Deliverables',
                        done: ['IN_PROGRESS', 'COMPLETED'].includes(app.status),
                        date:
                          app.status === 'IN_PROGRESS'
                            ? 'In Progress'
                            : app.status === 'COMPLETED'
                            ? 'Completed'
                            : 'Awaiting start',
                      },
                      {
                        title: '4. Defense & Certification',
                        done: app.status === 'COMPLETED',
                        date: app.certificateIssued ? 'Issued ✓' : app.status === 'COMPLETED' ? 'Verified' : 'Pending',
                      },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          step.done
                            ? 'border-[#28533D] bg-[#E4E9DD]/40 dark:bg-[#28382F]/40'
                            : 'border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1A1916]'
                        }`}
                      >
                        <div
                          className={`text-xs font-bold ${
                            step.done ? 'text-[#28533D] dark:text-[#88C49F]' : 'text-[#8E8B83]'
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-[10px] font-mono text-[#69665F] dark:text-[#A09D95] mt-1">
                          {step.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Candidate & Mentor Details Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#FAF8F3] dark:bg-[#1C1B18] text-xs">
                  <div>
                    <span className="font-mono text-[#69665F]">College:</span>
                    <p className="font-semibold text-[#24231F] dark:text-[#FFFDF8] truncate">{app.college}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[#69665F]">Start Date:</span>
                    <p className="font-semibold text-[#24231F] dark:text-[#FFFDF8]">{app.preferredStartDate}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[#69665F]">Verification:</span>
                    <p className="font-semibold text-[#24231F] dark:text-[#FFFDF8]">
                      {app.verifiedBy ? `By: ${app.verifiedBy}` : 'Pending Admin Assignment'}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[#69665F]">Certificate State:</span>
                    <p className="font-semibold text-[#28533D] dark:text-[#88C49F]">
                      {app.officialCertificate?.status === 'VALID'
                        ? `Issued · ${app.officialCertificate.certificateId}`
                        : app.officialCertificate?.status === 'REVOKED'
                          ? 'Revoked'
                          : app.status === 'COMPLETED' && app.paymentStatus === 'PAID_VERIFIED'
                            ? 'Awaiting official issuance'
                            : 'Awaiting completion'}
                    </p>
                  </div>
                </div>

                {/* Status Notice if checked */}
                {(statusNotice[app.applicationId] || statusNotice.download || statusNotice.share) && (
                  <div className="p-3 bg-[#FAF8F3] dark:bg-[#1C1B18] border border-[#DED9CE] dark:border-[#383630] rounded-xl text-xs font-mono text-[#28533D] dark:text-[#88C49F]">
                    {statusNotice[app.applicationId]}
                  </div>
                )}

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-[#69665F]">
                    {app.paymentStatus !== 'PAID_VERIFIED' ? (
                      <span className="text-[#EF592A] font-semibold">
                        ⚠️ Registration requires verified payment of ₹99.00 fee.
                      </span>
                    ) : app.certificateIssued ? (
                      <span className="text-[#28533D] font-bold">
                        ✓ Official certificate ready for download in your Certificate Library.
                      </span>
                    ) : app.certificateIssued ? (
                      <span className="text-[#28533D] font-bold">
                        ✓ Official completion certificate is ready.
                      </span>
                    ) : app.status === 'COMPLETED' ? (
                      <span>Completion recorded. Waiting for authorized certificate issuance.</span>
                    ) : (
                      <span>₹99 registration payment is verified. Complete the internship and mentor review to unlock the completion certificate.</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {app.paymentStatus !== 'PAID_VERIFIED' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckPaymentStatus(app.applicationId)}
                          disabled={checkingAppId === app.applicationId}
                          className="px-3.5 py-1.5 rounded-xl border border-[#DED9CE] text-xs font-semibold text-[#69665F] hover:text-[#24231F] cursor-pointer disabled:opacity-50"
                        >
                          {checkingAppId === app.applicationId ? 'Checking...' : 'Check Status'}
                        </button>
                        <Link
                          href={`/internships/apply?resume=${app.applicationId}`}
                          className="px-4 py-2 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-xs"
                        >
                          Pay ₹99 Securely →
                        </Link>
                      </>
                    ) : app.officialCertificate?.status === 'VALID' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => downloadOfficialCertificate(app.officialCertificate)}
                          className="px-3.5 py-2 rounded-xl bg-[#EF592A] text-white text-xs font-semibold hover:bg-[#d64b20]"
                        >
                          Download PDF ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => shareOfficialCertificate(app.officialCertificate)}
                          className="px-3.5 py-2 rounded-xl border border-[#28533D]/30 text-[#28533D] text-xs font-semibold hover:bg-[#E4E9DD]/50"
                        >
                          Share ↗
                        </button>
                        <Link
                          href="/certificates"
                          className="px-3.5 py-2 rounded-xl bg-[#28533D] text-white text-xs font-semibold hover:bg-[#1f4230]"
                        >
                          Certificate Library
                        </Link>
                      </>
                    ) : app.officialCertificate?.status === 'REVOKED' ? (
                      <span className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                        Certificate revoked
                      </span>
                    ) : app.paymentStatus === 'PAID_VERIFIED' ? (
                      <Link
                        href="/certificates"
                        className="px-3.5 py-2 rounded-xl border border-[#DED9CE] text-[#28533D] text-xs font-semibold hover:border-[#28533D]"
                      >
                        Track Certificate Progress →
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
