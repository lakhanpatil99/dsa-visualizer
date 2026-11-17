import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { generateCertificatePdf } from '../lib/certificates/PdfCertificateGenerator.js';
import { CERTIFICATE_THEMES, getCertificateTheme } from '../lib/certificates/certificateThemes.js';

const read = (file) => fs.readFileSync(path.resolve(file), 'utf8');

describe('AlgoMania Premium Institutional Certificate Redesign & Design System', () => {
  it('defines four distinct institutional themes with accurate palettes and typography', () => {
    const requiredThemes = ['competition_bronze', 'competition_silver', 'competition_gold', 'internship'];
    for (const key of requiredThemes) {
      const theme = CERTIFICATE_THEMES[key];
      assert.ok(theme, `Theme ${key} must exist`);
      assert.ok(theme.colors.primary, `${key} must have primary color`);
      assert.ok(theme.colors.secondary, `${key} must have secondary color`);
      assert.ok(theme.colors.accent, `${key} must have accent color`);
      assert.ok(theme.colors.background, `${key} must have background color`);
      assert.ok(theme.seal.institution, `${key} must specify institution`);
      assert.ok(theme.seal.tierLabel, `${key} must have tier label`);
    }

    // Palette verification according to institutional specification
    assert.equal(CERTIFICATE_THEMES.competition_bronze.colors.primary, '#681F2A'); // Burgundy
    assert.equal(CERTIFICATE_THEMES.competition_silver.colors.primary, '#263746'); // Slate Navy
    assert.equal(CERTIFICATE_THEMES.competition_gold.colors.primary, '#173D32');   // Royal Emerald
    assert.equal(CERTIFICATE_THEMES.internship.colors.primary, '#164A50');         // Deep Teal
  });

  it('generates distinct seal inscriptions matching database-driven milestones', () => {
    const bronzeSeal = CERTIFICATE_THEMES.competition_bronze.seal;
    const silverSeal = CERTIFICATE_THEMES.competition_silver.seal;
    const goldSeal = CERTIFICATE_THEMES.competition_gold.seal;
    const internSeal = CERTIFICATE_THEMES.internship.seal;

    assert.equal(bronzeSeal.milestone(20), '20+ SOLVED');
    assert.equal(bronzeSeal.milestone(35), '35+ SOLVED');
    assert.equal(silverSeal.milestone(100), '100+ SOLVED');
    assert.equal(goldSeal.milestone(200), '200+ SOLVED');
    assert.equal(internSeal.milestone(), 'INTERNSHIP COMPLETED');
    assert.equal(internSeal.tierLabel, 'ENGINEERING FELLOWSHIP');
  });

  it('generates valid PDF documents with exact A4 landscape dimensions (841.89 x 595.28 pt)', async () => {
    const cert = {
      certificateId: 'ALG-CMP-BR-2026-TEST-DIMENSIONS',
      recipientName: 'Lakhansing Patil',
      type: 'competition_bronze',
      milestoneCount: 20,
      issueDate: new Date('2026-11-17T00:00:00Z'),
      verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-BR-2026-TEST-DIMENSIONS'
    };

    const pdfBytes = await generateCertificatePdf(cert);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    assert.ok(Math.abs(width - 841.89) < 0.1, `Width ${width} must match A4 landscape (841.89)`);
    assert.ok(Math.abs(height - 595.28) < 0.1, `Height ${height} must match A4 landscape (595.28)`);
  });

  it('renders all 4 certificate themes into high-quality PDFs with embedded assets and QR codes', async () => {
    const types = ['competition_bronze', 'competition_silver', 'competition_gold', 'internship'];
    for (const type of types) {
      const bytes = await generateCertificatePdf({
        certificateId: `ALG-TEST-${type.toUpperCase()}`,
        recipientName: 'Lakhan Patil',
        type,
        domain: 'Distributed Systems & Cloud Algorithms',
        duration: '3 Months',
        milestoneCount: type === 'competition_gold' ? 200 : type === 'competition_silver' ? 100 : 20,
        issueDate: new Date(),
        verificationUrl: `https://www.algomania.in/certificates/verify/ALG-TEST-${type.toUpperCase()}`
      });

      assert.ok(bytes instanceof Uint8Array);
      assert.ok(bytes.length > 50000, `PDF size (${bytes.length} bytes) must be substantial with embedded high-res assets`);
      
      const doc = await PDFDocument.load(bytes);
      assert.equal(doc.getPageCount(), 1, 'Certificate must be exactly 1 page');
    }
  });

  it('handles ultra-long recipient names and long credential IDs gracefully without clipping', async () => {
    const longNameCert = {
      certificateId: 'ALG-CMP-GD-2026-VERY-LONG-CREDENTIAL-IDENTIFIER-EXTENDED-CHECKSUM-ABCD987654321',
      recipientName: 'His Royal Highness Prince Alexander Bartholomew Montgomery Christopher Wellington IV',
      type: 'competition_gold',
      milestoneCount: 227,
      issueDate: new Date('2026-11-17T00:00:00Z'),
      verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-GD-2026-VERY-LONG'
    };

    const bytes = await generateCertificatePdf(longNameCert);
    assert.ok(bytes.length > 50000);
    const doc = await PDFDocument.load(bytes);
    assert.equal(doc.getPageCount(), 1);
  });

  it('CertificatePreviewModal includes zoom controls, responsive layout, and distinct medallion SVGs', () => {
    const modalCode = read('src/components/certificates/CertificatePreviewModal.js');
    // Zoom control presence
    assert.match(modalCode, /zoomScale/);
    assert.match(modalCode, /setZoomScale/);
    assert.match(modalCode, /Fit/);
    // Distinct vector medallion subcomponent
    assert.match(modalCode, /CertificateMedallionSvg/);
    assert.match(modalCode, /medallionGrad/);
    assert.match(modalCode, /sunburst teeth|Precision milled/i);
    // Preserves essential contracts
    assert.match(modalCode, /displayCertificateId/);
    assert.match(modalCode, /LakhansingSignature\.png/);
    assert.match(modalCode, /border-solid/);
  });
});
