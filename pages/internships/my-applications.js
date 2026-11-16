import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    async function fetchApplications() {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/internships/my-applications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications || []);
        } else {
          setError(data.message || 'Failed to load applications.');
        }
      } catch (err) {
        setError('Network error while retrieving applications.');
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchApplications();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, isAuthenticated, authLoading]);

  const getStatusBadge = (status) => {
    const styles = {
      PENDING_REVIEW: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
      APPROVED: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
      IN_PROGRESS: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
      COMPLETED: 'bg-[#28533D] text-[#FFFDF8]',
      REJECTED: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${styles[status] || styles.PENDING_REVIEW}`}>
        {status.replace('_', ' ')}
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
              <Link href="/internships" className="hover:text-[#EF592A]">Internships</Link>
              <span>/</span>
              <span className="text-[#24231F] dark:text-[#FFFDF8] font-bold">Applications Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
              My Fellowship Applications & Milestones
            </h1>
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
            <p className="text-sm text-[#69665F] dark:text-[#8E8B83] mb-4">Please sign in to view your applications and credential progress.</p>
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
                  <div>
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
                        date: new Date(app.appliedAt || app.createdAt).toLocaleDateString()
                      },
                      {
                        title: '2. Review & Approval',
                        done: ['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(app.status),
                        date: app.status === 'PENDING_REVIEW' ? 'Pending Review' : 'Verified'
                      },
                      {
                        title: '3. Sprint Deliverables',
                        done: ['IN_PROGRESS', 'COMPLETED'].includes(app.status),
                        date: app.status === 'IN_PROGRESS' ? 'In Progress' : app.status === 'COMPLETED' ? 'Completed' : 'Awaiting start'
                      },
                      {
                        title: '4. Defense & Certification',
                        done: app.status === 'COMPLETED',
                        date: app.certificateIssued ? 'Issued ✓' : app.status === 'COMPLETED' ? 'Verified' : 'Pending'
                      }
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          step.done
                            ? 'border-[#28533D] bg-[#E4E9DD]/40 dark:bg-[#28382F]/40'
                            : 'border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1A1916]'
                        }`}
                      >
                        <div className={`text-xs font-bold ${step.done ? 'text-[#28533D] dark:text-[#88C49F]' : 'text-[#8E8B83]'}`}>
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
                      {app.certificateIssued ? `Issued (${app.certificateId})` : 'Awaiting Completion'}
                    </p>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-[#69665F]">
                    {app.certificateIssued ? (
                      <span className="text-[#28533D] font-bold">✓ Official certificate ready for download in your Certificate Library.</span>
                    ) : (
                      <span>Certificate issuance requires completion approval & verified payment processing.</span>
                    )}
                  </div>
                  {app.certificateIssued && (
                    <Link
                      href="/certificates"
                      className="px-4 py-2 rounded-xl bg-[#28533D] text-[#FFFDF8] text-xs font-semibold hover:bg-[#1f4230]"
                    >
                      View in Certificates Library →
                    </Link>
                  )}
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
