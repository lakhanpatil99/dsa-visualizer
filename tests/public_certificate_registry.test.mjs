import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(path.resolve(file), 'utf8');

describe('AlgoMania public credential registry contracts', () => {
  it('uses MongoDB as the only authority for public certificate verification', () => {
    const service = read('lib/certificates/publicVerification.js');
    const api = read('pages/api/certificates/verify/[id].js');
    assert.match(service, /await dbConnect\(\)/);
    assert.match(service, /Certificate\.findOne\(\{ certificateId \}\)/);
    assert.match(service, /readyState !== 1/);
    assert.doesNotMatch(api, /memoryStore/);
    assert.match(api, /status: 'UNAVAILABLE'/);
    assert.match(api, /res\.status\(503\)/);
  });

  it('does not make the public verification page depend on localhost or an internal HTTP fetch', () => {
    const page = read('pages/certificates/verify/[certificateId].js');
    assert.match(page, /getPublicCertificateById/);
    assert.doesNotMatch(page, /localhost:3000/);
    assert.doesNotMatch(page, /fetch\(/);
    assert.match(page, /Verification temporarily unavailable/);
  });

  it('keeps public verification pages independent of authentication guards', () => {
    const searchPage = read('pages/certificates/verify/index.js');
    const resultPage = read('pages/certificates/verify/[certificateId].js');
    assert.match(searchPage, /method="GET"/);
    assert.match(searchPage, /no sign-in required/);
    assert.doesNotMatch(searchPage, /useAuth|withAuth/);
    assert.doesNotMatch(resultPage, /useAuth|withAuth/);
  });

  it('uses a unique sparse source key and cryptographically random 128-bit IDs for new issuance', () => {
    const model = read('models/Certificate.js');
    const issuer = read('pages/api/admin/issue-certificate.js');
    assert.match(model, /unique: true, sparse: true, name: 'certificate_sourceKey_unique'/);
    assert.match(issuer, /sourceKey/);
    assert.match(issuer, /crypto\.randomBytes\(16\)/);
    assert.match(issuer, /findOne\(\{ sourceKey \}\)/);
  });

  it('never fabricates an issued competition credential in the browser', () => {
    const competitions = read('pages/competitions/index.js');
    const modal = read('src/components/certificates/CertificatePreviewModal.js');
    assert.match(competitions, /data\.issuedCertificates/);
    assert.match(competitions, /issuedCertificate \? 'ISSUED' : (?:revokedCertificate \? 'REVOKED' : )?isUnlocked \? 'PENDING_ISSUANCE'/);
    assert.doesNotMatch(competitions, /ALG-COMP-\$\{tier\.toUpperCase\(\)\}/);
    assert.match(modal, /PENDING_ISSUANCE/);
    assert.match(modal, /NO OFFICIAL ID/);
  });
});
