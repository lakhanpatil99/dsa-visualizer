/**
 * Thread-safe In-Memory fallback store for AlgoMania Career & Certification Platform.
 * Enables zero-downtime operation, local prototyping, and 100% deterministic test execution
 * when running without an active MongoDB Atlas daemon.
 */

class MemoryStore {
  constructor() {
    this.internshipApplications = new Map();
    this.competitionSubmissions = new Map();
    this.competitionAchievements = new Map();
    this.certificates = new Map();
    this.auditLogs = [];
    this.paymentRecords = new Map();
  }

  // --- Internship Applications ---
  saveApplication(app) {
    this.internshipApplications.set(app.applicationId, { ...app });
    return this.internshipApplications.get(app.applicationId);
  }

  getApplication(id) {
    return this.internshipApplications.get(id) || null;
  }

  getApplicationsByUser(firebaseUid) {
    return Array.from(this.internshipApplications.values())
      .filter(a => a.firebaseUid === firebaseUid);
  }

  getAllApplications() {
    return Array.from(this.internshipApplications.values());
  }

  updateApplication(id, updates) {
    const existing = this.internshipApplications.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.internshipApplications.set(id, updated);
    return updated;
  }

  // --- Competition Achievements ---
  getAchievement(firebaseUid) {
    return this.competitionAchievements.get(firebaseUid) || null;
  }

  saveAchievement(achievement) {
    this.competitionAchievements.set(achievement.firebaseUid, { ...achievement });
    return this.competitionAchievements.get(achievement.firebaseUid);
  }

  // --- Submissions ---
  saveSubmission(sub) {
    this.competitionSubmissions.set(sub.submissionId, { ...sub });
    return this.competitionSubmissions.get(sub.submissionId);
  }

  getSubmissionsByUser(firebaseUid) {
    return Array.from(this.competitionSubmissions.values())
      .filter(s => s.firebaseUid === firebaseUid);
  }

  // --- Certificates ---
  saveCertificate(cert) {
    this.certificates.set(cert.certificateId, { ...cert });
    return this.certificates.get(cert.certificateId);
  }

  getCertificate(id) {
    return this.certificates.get(id) || null;
  }

  getCertificatesByUser(firebaseUid) {
    return Array.from(this.certificates.values())
      .filter(c => c.firebaseUid === firebaseUid);
  }

  updateCertificate(id, updates) {
    const existing = this.certificates.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.certificates.set(id, updated);
    return updated;
  }

  // --- Audit Logs ---
  logAction(entry) {
    const log = { ...entry, id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, timestamp: new Date() };
    this.auditLogs.push(log);
    return log;
  }

  getAuditLogs() {
    return [...this.auditLogs];
  }

  // --- Payment Records ---
  savePayment(pay) {
    this.paymentRecords.set(pay.paymentId, { ...pay });
    return this.paymentRecords.get(pay.paymentId);
  }

  getPayment(id) {
    return this.paymentRecords.get(id) || null;
  }

  clear() {
    this.internshipApplications.clear();
    this.competitionSubmissions.clear();
    this.competitionAchievements.clear();
    this.certificates.clear();
    this.auditLogs = [];
    this.paymentRecords.clear();
  }
}

// Global cached instance
let store = global.__algomania_memory_store;
if (!store) {
  store = global.__algomania_memory_store = new MemoryStore();
}

export default store;
