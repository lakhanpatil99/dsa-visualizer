import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generateCertificatePdf } from '../lib/certificates/PdfCertificateGenerator.js';

const read = (file) => fs.readFileSync(path.resolve(file), 'utf8');

describe('AlgoMania Professional Certificate Design & Layout Refinements', () => {
  it('PdfCertificateGenerator eliminates empty outlined corner squares', () => {
    const generatorCode = read('lib/certificates/PdfCertificateGenerator.js');
    // Ensure the 4 corner rectangles loop is removed
    assert.doesNotMatch(generatorCode, /page\.drawRectangle\(\{\s*x:\s*c\.x,\s*y:\s*c\.y\s*-\s*cornerSize/);
    assert.doesNotMatch(generatorCode, /const\s+cornerSize\s*=/);
    // Ensure subtle institutional corner join accents or clean double framing is present
    assert.match(generatorCode, /inner delicate decorative border/i);
  });

  it('PdfCertificateGenerator positions bottom verification footnote with safe clearance', () => {
    const generatorCode = read('lib/certificates/PdfCertificateGenerator.js');
    // Footnote must be at y: 44 (not y: 35) to prevent overlapping the border at y: 30
    assert.match(generatorCode, /y:\s*44/);
    assert.match(generatorCode, /width:\s*boxWidth/);
    assert.match(generatorCode, /boxWidth\s*=\s*520/);
  });

  it('generates valid PDF for long recipient names and long credential IDs without throwing', async () => {
    const sampleCert = {
      certificateId: 'ALG-CMP-BR-2026-B400DC6F31B20D9776DA8A9D1B10DE74',
      recipientName: 'Prof. Dr. Alexander Maximilian Bartholomew-Montgomery III',
      type: 'competition_bronze',
      milestoneCount: 20,
      issueDate: new Date('2026-11-17T00:00:00Z'),
      verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-BR-2026-B400DC6F31B20D9776DA8A9D1B10DE74'
    };

    const pdfBytes = await generateCertificatePdf(sampleCert);
    assert.ok(pdfBytes instanceof Uint8Array);
    assert.ok(pdfBytes.length > 5000);

    const header = String.fromCharCode(...pdfBytes.slice(0, 5));
    assert.equal(header, '%PDF-');
  });

  it('generates valid PDFs for all certificate categories and themes', async () => {
    const types = ['internship', 'competition_bronze', 'competition_silver', 'competition_gold'];
    for (const type of types) {
      const bytes = await generateCertificatePdf({
        certificateId: `ALG-TEST-2026-${type.toUpperCase()}`,
        recipientName: 'Lakhansing Patil',
        type,
        domain: 'Software Engineering (Java)',
        title: 'Software Engineering Program',
        milestoneCount: type === 'competition_gold' ? 200 : type === 'competition_silver' ? 100 : 20,
        issueDate: new Date()
      });
      assert.ok(bytes.length > 5000, `Type ${type} must generate valid non-empty PDF`);
    }
  });

  it('CertificatePreviewModal uses solid refined border and properly sized signature', () => {
    const modalCode = read('src/components/certificates/CertificatePreviewModal.js');
    assert.doesNotMatch(modalCode, /border-dashed\s+\$\{borderColor\}/);
    assert.match(modalCode, /border-solid/);
    assert.match(modalCode, /h-16\s+w-auto/);
    assert.match(modalCode, /LakhansingSignature\.png/);
    assert.match(modalCode, /displayCertificateId/);
  });

  it('Public Verification page formats Credential ID with monospace and hides unrecorded dates', () => {
    const pageCode = read('pages/certificates/verify/[certificateId].js');
    assert.match(pageCode, /isMono=\{true\}/);
    assert.match(pageCode, /if\s*\(!value\)\s*return\s*null/);
    assert.doesNotMatch(pageCode, /return\s*'Not recorded'/);
  });
});
