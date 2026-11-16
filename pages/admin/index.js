import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';

export default function AdminPortal() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modal / Action states
  const [selectedApp, setSelectedApp] = useState(null);
  const [revokeCertId, setRevokeCertId] = useState('');
  const [revokeReason, setRevokeReason] = useState('');

  const fetchApplications = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      } else {
        setErrorMsg(data.message || 'Access restricted.');
      }
    } catch (err) {
      setErrorMsg('Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, isAuthenticated, authLoading]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/update-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Application ${applicationId} status updated to ${newStatus}.`);
        fetchApplications();
      } else {
        setErrorMsg(data.message || 'Status update failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to update application.');
    }
  };

  const handleIssueCertificate = async (app) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/issue-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'internship',
          targetId: app.applicationId,
          recipientName: app.fullName,
          domain: app.domainTitle,
          duration: app.duration
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Certificate ${data.certificate.certificateId} issued to ${app.fullName}!`);
        fetchApplications();
      } else {
        setErrorMsg(data.message || 'Certificate issuance failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to issue certificate.');
    }
  };

  const handleRevokeCertificate = async (e) => {
    e.preventDefault();
    if (!revokeCertId.trim()) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/revoke-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          certificateId: revokeCertId.trim(),
          reason: revokeReason || 'Administrative revocation'
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Certificate ${revokeCertId} has been revoked.`);
        setRevokeCertId('');
        setRevokeReason('');
      } else {
        setErrorMsg(data.message || 'Revocation failed.');
      }
    } catch (err) {
      setErrorMsg('Revocation failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>Administrative Operations — AlgoMania</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 border-b border-[#DED9CE] dark:border-[#2E2C27] pb-6 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>🔒</span>
              <span>Privileged Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
              AlgoMania Administrative Operations Center
            </h1>
          </div>
        </div>

        {actionMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
            ✓ {actionMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-100 text-red-800 text-xs font-mono">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mb-6 border-b border-[#DED9CE] dark:border-[#2E2C27] pb-3">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase ${
              activeTab === 'applications'
                ? 'bg-[#28533D] text-[#FFFDF8]'
                : 'text-[#69665F] hover:text-[#24231F]'
            }`}
          >
            Internship Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('revocation')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase ${
              activeTab === 'revocation'
                ? 'bg-[#28533D] text-[#FFFDF8]'
                : 'text-[#69665F] hover:text-[#24231F]'
            }`}
          >
            Credential Revocation
          </button>
        </div>

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-[#69665F]">
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#69665F] bg-[#FFFDF8] dark:bg-[#24231F] rounded-xl border border-[#DED9CE]">
                No applications found.
              </div>
            ) : (
              <div className="overflow-x-auto bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F3] dark:bg-[#1C1B18] border-b border-[#DED9CE] dark:border-[#383630] font-mono text-[#69665F]">
                    <tr>
                      <th className="p-4">App ID</th>
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Domain / Duration</th>
                      <th className="p-4">College</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DED9CE] dark:divide-[#383630]">
                    {applications.map((app) => (
                      <tr key={app.applicationId} className="hover:bg-[#FAF8F3] dark:hover:bg-[#1F1E1B]">
                        <td className="p-4 font-mono font-bold text-[#EF592A]">{app.applicationId}</td>
                        <td className="p-4">
                          <div className="font-bold text-[#24231F] dark:text-[#FFFDF8]">{app.fullName}</div>
                          <div className="text-[10px] text-[#69665F]">{app.userEmail}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-[#28533D] dark:text-[#88C49F]">{app.domainTitle}</span>
                          <div className="text-[10px] text-[#69665F]">{app.duration.replace('_', ' ')}</div>
                        </td>
                        <td className="p-4 text-[#69665F]">{app.college}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FAF8F3] border border-[#DED9CE]">
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {app.status === 'PENDING_REVIEW' && (
                              <button
                                onClick={() => handleUpdateStatus(app.applicationId, 'APPROVED')}
                                className="px-2.5 py-1 bg-blue-600 text-white rounded text-[10px] font-bold"
                              >
                                Approve
                              </button>
                            )}
                            {app.status === 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateStatus(app.applicationId, 'IN_PROGRESS')}
                                className="px-2.5 py-1 bg-amber-600 text-white rounded text-[10px] font-bold"
                              >
                                Start
                              </button>
                            )}
                            {app.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => handleUpdateStatus(app.applicationId, 'COMPLETED')}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                              >
                                Mark Completed
                              </button>
                            )}
                            {app.status === 'COMPLETED' && !app.certificateIssued && (
                              <button
                                onClick={() => handleIssueCertificate(app)}
                                className="px-2.5 py-1 bg-[#28533D] text-white rounded text-[10px] font-bold"
                              >
                                Issue Cert
                              </button>
                            )}
                            {app.certificateIssued && (
                              <span className="text-[10px] text-[#28533D] font-mono font-bold">
                                Issued: {app.certificateId}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REVOCATION TAB */}
        {activeTab === 'revocation' && (
          <div className="p-6 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-xs max-w-xl space-y-4">
            <h3 className="text-base font-bold text-[#24231F] dark:text-[#FFFDF8]">
              Revoke an Existing Credential
            </h3>
            <p className="text-xs text-[#69665F] leading-relaxed">
              Revoking a credential marks it invalid in the public verification registry. Once revoked, the certificate can no longer be downloaded or verified as valid.
            </p>

            <form onSubmit={handleRevokeCertificate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#69665F] mb-1">
                  Certificate ID (e.g. ALG-2026-XXXXX) *
                </label>
                <input
                  type="text"
                  value={revokeCertId}
                  onChange={(e) => setRevokeCertId(e.target.value)}
                  required
                  placeholder="ALG-2026-ABC12"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] bg-[#FAF8F3] text-xs font-mono text-[#24231F]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#69665F] mb-1">
                  Revocation Reason *
                </label>
                <input
                  type="text"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  required
                  placeholder="e.g. Plagiarism detected or administrative reassessment."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] bg-[#FAF8F3] text-xs text-[#24231F]"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm Revocation
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
