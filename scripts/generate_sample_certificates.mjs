import fs from 'fs';
import path from 'path';
import { generateCertificatePdf } from '../lib/certificates/PdfCertificateGenerator.js';

const outputDir = path.resolve('tests/output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sampleCerts = [
  {
    type: 'competition_bronze',
    certificateId: 'ALG-CMP-BR-2026-B400DC6F31B20D9776DA8A9D1B10DE74',
    recipientName: 'Lakhansing Patil',
    milestoneCount: 20,
    issueDate: new Date('2026-11-17T00:00:00Z'),
    verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-BR-2026-B400DC6F31B20D9776DA8A9D1B10DE74'
  },
  {
    type: 'competition_silver',
    certificateId: 'ALG-CMP-SL-2026-E78A9C123F45D67890ABCDEF12345678',
    recipientName: 'Aarav Sharma',
    milestoneCount: 100,
    issueDate: new Date('2026-11-17T00:00:00Z'),
    verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-SL-2026-E78A9C123F45D67890ABCDEF12345678'
  },
  {
    type: 'competition_gold',
    certificateId: 'ALG-CMP-GD-2026-99F123456789ABCDEF0123456789ABCD',
    recipientName: 'Priya Sundaram',
    milestoneCount: 200,
    issueDate: new Date('2026-11-17T00:00:00Z'),
    verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-GD-2026-99F123456789ABCDEF0123456789ABCD'
  },
  {
    type: 'internship',
    certificateId: 'ALG-INT-JV-2026-A1B2C3D4E5F67890123456789ABCDEF0',
    recipientName: 'Lakhansing Patil',
    domain: 'Software Engineering (Java)',
    title: 'Software Engineering Program',
    duration: '2 Months',
    issueDate: new Date('2026-11-17T00:00:00Z'),
    verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-INT-JV-2026-A1B2C3D4E5F67890123456789ABCDEF0'
  },
  {
    type: 'competition_gold',
    certificateId: 'ALG-CMP-GD-2026-EXTRA-LONG-CREDENTIAL-IDENTIFIER-TEST-0000000001',
    recipientName: 'Prof. Dr. Alexander Maximilian Bartholomew-Montgomery III',
    milestoneCount: 227,
    issueDate: new Date('2026-11-17T00:00:00Z'),
    verificationUrl: 'https://www.algomania.in/certificates/verify/ALG-CMP-GD-2026-EXTRA-LONG-CREDENTIAL-IDENTIFIER-TEST-0000000001'
  }
];

async function run() {
  console.log('Generating sample institutional certificates...');
  for (const cert of sampleCerts) {
    const filename = `${cert.type}-${cert.recipientName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}.pdf`;
    const dest = path.join(outputDir, filename);
    const pdfBytes = await generateCertificatePdf(cert);
    fs.writeFileSync(dest, pdfBytes);
    console.log(`✓ Generated ${filename} (${pdfBytes.length} bytes)`);
  }
  console.log('All sample certificates generated in tests/output/');
}

run().catch(console.error);
