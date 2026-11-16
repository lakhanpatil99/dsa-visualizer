import fs from 'fs';
import path from 'path';

function buildIco(imageBuffers) {
  const count = imageBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type
  header.writeUInt16LE(count, 4); // count of images

  const dirEntries = [];
  const payloadBuffers = [];

  for (const { buffer, width, height } of imageBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data

    dirEntries.push(entry);
    payloadBuffers.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...payloadBuffers]);
}

const p16 = fs.readFileSync('public/favicon-16.png');
const p32 = fs.readFileSync('public/favicon-32.png');
const p48 = fs.readFileSync('public/favicon-48.png');

const icoBuffer = buildIco([
  { buffer: p16, width: 16, height: 16 },
  { buffer: p32, width: 32, height: 32 },
  { buffer: p48, width: 48, height: 48 }
]);

fs.writeFileSync('public/favicon.ico', icoBuffer);
console.log('Successfully generated multi-resolution public/favicon.ico with 16x16, 32x32, 48x48. Total size:', icoBuffer.length, 'bytes');
