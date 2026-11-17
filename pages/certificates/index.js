import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import CertificatePreviewModal from '../../src/components/certificates/CertificatePreviewModal';
import AchievementBadge from '../../src/components/competitions/AchievementBadge';

export default function MyCertificatesDashboard() {
  const { user, isAuthenticated, getIdToken, loading: authLoading } = useAuth();
  const [issuedCerts, setIssuedCerts] = useState([]);
  const [pendingCerts, setPendingCerts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewCert, setPreviewCert] = useState(null);
  const [copyNotification, setCopyNotification] = useState('');
  const [dataError, setDataError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const getAuthToken = useCallback(async (forceRefresh = false) => {
    try {
      if (typeof user?.getIdToken === 'function') return await user.getIdToken(forceRefresh);
      if (typeof getIdToken === 'function') return await getIdToken(forceRefresh);
    } catch {}
    return null;
  }, [user, getIdToken]);

  const loadCertificates = useCallback(async ({ silent = false } = {}) => {
    if (!user) return;
    if (!silent) setLoading(true);
    setRefreshing(true);

    try {
      const token = await getAuthToken();
      const response = await fetch('/api/certificates/my-certificates', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Certificate records could not be synchronized.');
      }

      setIssuedCerts(data.issuedCertificates || []);
      setPendingCerts(data.pendingCertificates || []);
      setBadges(data.badges || []);
      setDataError('');
      setLastSyncedAt(new Date().toISOString());
    } catch (error) {
      console.error('[MyCertificates] Refresh failed:', error?.message || 'Unknown error');
      setDataError(error.message || 'Unable to synchronize certificate records.');
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

    loadCertificates();
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') loadCertificates({ silent: true });
    };
    const interval = setInterval(refreshIfVisible, 15000);
    window.addEventListener('focus', refreshIfVisible);
    document.addEventListener('visibilitychange', refreshIfVisible);
    window.addEventListener('online', refreshIfVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refreshIfVisible);
      document.removeEventListener('visibilitychange', refreshIfVisible);
      window.removeEventListener('online', refreshIfVisible);
    };
  }, [loadCertificates, isAuthenticated, authLoading]);

  const handleDownloadPdf = async (cert) => {
    if (!user) return;
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/certificates/download/${encodeURIComponent(cert.certificateId)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'no-store'
      });
      if (!res.ok) {
        throw new Error('Download failed.');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cert.certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      alert('Unable to download PDF certificate. ' + err.message);
    }
  };

  const getVerificationUrl = (cert) =>
    cert.verificationUrl || `https://www.algomania.in/certificates/verify/${cert.certificateId}`;

  const handleCopyLink = async (cert) => {
    const url = getVerificationUrl(cert);
    try {
      await navigator.clipboard.writeText(url);
      setCopyNotification(cert.certificateId);
      window.setTimeout(() => setCopyNotification(''), 3000);
    } catch {
      window.prompt('Copy the official certificate verification link:', url);
    }
  };

  const handleShareCertificate = async (cert) => {
    const url = getVerificationUrl(cert);
    try {
      if (navigator.share) {
        await navigator.share({
          title: cert.title || 'AlgoMania Certificate',
          text: `Verify my AlgoMania credential: ${cert.certificateId}`,
          url
        });
      } else {
        await handleCopyLink(cert);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        await handleCopyLink(cert);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>My Certificates & Verified Credentials — AlgoMania</title>
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-[#DED9CE] dark:border-[#2E2C27] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <span>📜</span>
              <span>Official Academic Credentials</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
              My Certificates & Achievement Vault
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] max-w-2xl">
              All certificates feature tamper-evident verification, academic Guilloché vector borders, official AlgoMania seal, and founder authorization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/certificates/verify"
              className="px-4 py-2.5 rounded-xl bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] border border-[#28533D]/30 text-xs font-semibold hover:border-[#28533D] flex items-center space-x-1.5"
            >
              <span>🛡️</span>
              <span>Verify Credential Registry ↗</span>
            </Link>
            <Link
              href="/competitions"
              className="px-4 py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] text-xs font-semibold hover:border-[#EF592A]"
            >
              Solve Challenges →
            </Link>
            <Link
              href="/internships"
              className="px-4 py-2.5 rounded-xl bg-[#28533D] text-[#FFFDF8] text-xs font-semibold hover:bg-[#1f4230]"
            >
              Fellowship Tracks →
            </Link>
            <div className="mt-2 text-[10px] font-mono text-[#8E8B83]">
              {lastSyncedAt ? `Live registry sync · ${new Date(lastSyncedAt).toLocaleTimeString()}` : 'Waiting for registry sync'}
              <button type="button" onClick={() => loadCertificates()} disabled={refreshing} className="ml-3 font-bold text-[#28533D] underline disabled:opacity-50">
                {refreshing ? 'Refreshing…' : 'Refresh now'}
              </button>
            </div>
          </div>
        </div>

        {dataError && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            {dataError} Previously synchronized records are kept; the page will retry automatically.
          </div>
        )}

        {copyNotification && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-mono font-bold text-center animate-fadeIn">
            ✓ Verification URL for credential {copyNotification} copied to clipboard!
          </div>
        )}

        {/* SECTION 1: METALLIC BADGES */}
        <div className="mb-12">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#69665F] dark:text-[#8E8B83] mb-4">
            Earned Competition Badges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AchievementBadge
              tier="bronze"
              unlocked={badges.find(b => b.tier === 'bronze')?.unlocked}
              currentCount={badges.find(b => b.tier === 'bronze')?.currentCount || 0}
            />
            <AchievementBadge
              tier="silver"
              unlocked={badges.find(b => b.tier === 'silver')?.unlocked}
              currentCount={badges.find(b => b.tier === 'silver')?.currentCount || 0}
            />
            <AchievementBadge
              tier="gold"
              unlocked={badges.find(b => b.tier === 'gold')?.unlocked}
              currentCount={badges.find(b => b.tier === 'gold')?.currentCount || 0}
            />
          </div>
        </div>

        {/* SECTION 2: ISSUED & VERIFIED CERTIFICATES */}
        <div className="mb-12">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#24231F] dark:text-[#FFFDF8] mb-4">
            Verified Certificates ({issuedCerts.length})
          </h2>

          {loading && (
            <div className="p-8 text-center text-xs font-mono text-[#69665F]">
              Loading credentials...
            </div>
          )}

          {!loading && issuedCerts.length === 0 && (
            <div className="p-8 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] text-center space-y-2">
              <span className="text-2xl">🎓</span>
              <p className="text-sm font-bold text-[#24231F] dark:text-[#FFFDF8]">No Issued Certificates Yet</p>
              <p className="text-xs text-[#69665F] dark:text-[#8E8B83] max-w-sm mx-auto">
                Certificates are issued upon completing fellowship tracks or achieving competition milestones (20, 100, 200 solved).
              </p>
            </div>
          )}

          {!loading && issuedCerts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {issuedCerts.map((cert) => (
                <div
                  key={cert.certificateId}
                  className="p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#28533D] shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD]">
                        {cert.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-[#69665F]">
                        ID: {cert.certificateId}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-[#69665F] dark:text-[#A09D95] mt-1 leading-relaxed">
                      {cert.description}
                    </p>

                    <div className="mt-3 text-[11px] font-mono text-[#69665F] dark:text-[#8E8B83]">
                      Recipient: <span className="font-bold text-[#24231F] dark:text-[#FFFDF8]">{cert.recipientName}</span> • Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions are enabled only for a real, currently valid registry record. */}
                  <div className="pt-3 border-t border-[#DED9CE] dark:border-[#383630] flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="px-3.5 py-2 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-semibold shadow-xs"
                    >
                      Preview Credential
                    </button>
                    {cert.status === 'VALID' ? (
                      <button
                        onClick={() => handleDownloadPdf(cert)}
                        className="px-3.5 py-2 rounded-xl bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] text-xs font-semibold shadow-xs"
                      >
                        Download PDF ↓
                      </button>
                    ) : (
                      <span className="px-3 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                        Certificate revoked
                      </span>
                    )}
                    <button
                      onClick={() => handleShareCertificate(cert)}
                      className="px-3 py-2 rounded-xl border border-[#28533D]/30 text-xs font-semibold text-[#28533D] hover:bg-[#E4E9DD]/50"
                    >
                      Share ↗
                    </button>
                    <button
                      onClick={() => handleCopyLink(cert)}
                      className="px-3 py-2 rounded-xl border border-[#DED9CE] dark:border-[#383630] text-xs font-semibold hover:border-[#EF592A]"
                    >
                      Copy Link
                    </button>
                    <Link
                      href={`/certificates/verify/${cert.certificateId}`}
                      target="_blank"
                      className="px-3 py-2 text-xs font-mono text-[#69665F] hover:text-[#28533D]"
                    >
                      Verify Page ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: LOCKED / PENDING CERTIFICATES */}
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#69665F] dark:text-[#8E8B83] mb-4">
            Pending & Locked Credentials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pendingCerts.map((pc) => (
              <div
                key={pc.id}
                className="p-5 rounded-2xl bg-[#FAF8F3]/60 dark:bg-[#1A1916]/50 border border-[#DED9CE] dark:border-[#383630] opacity-85 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#8E8B83] uppercase">
                      {pc.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#8E8B83]">🔒 Locked</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#24231F] dark:text-[#FFFDF8]">
                    {pc.title}
                  </h4>
                  <p className="text-[11px] text-[#69665F] dark:text-[#8E8B83] mt-2 leading-relaxed">
                    {pc.lockReason}
                  </p>
                  {pc.type.startsWith('competition_') && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E9DD]">
                        <div className="h-full rounded-full bg-[#EF592A]" style={{ width: `${Math.min(100, Math.round((pc.currentProgress / pc.targetProgress) * 100))}%` }} />
                      </div>
                      <p className="mt-1 text-[10px] font-mono text-[#8E8B83]">
                        {pc.currentProgress}/{pc.targetProgress} unique accepted problems
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#DED9CE]/60 dark:border-[#383630]/60">
                  {pc.type.startsWith('competition_') ? (
                    <Link
                      href="/competitions"
                      className="text-xs font-semibold text-[#EF592A] hover:underline"
                    >
                      Solve Challenges in Arena →
                    </Link>
                  ) : (
                    <Link
                      href="/internships/my-applications"
                      className="text-xs font-semibold text-[#28533D] dark:text-[#88C49F] hover:underline"
                    >
                      View Fellowship Status →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Interactive Modal Preview */}
      <CertificatePreviewModal
        certificate={previewCert}
        isOpen={Boolean(previewCert)}
        onClose={() => setPreviewCert(null)}
        onDownload={handleDownloadPdf}
        onShare={handleShareCertificate}
      />

      <Footer />
    </div>
  );
}
