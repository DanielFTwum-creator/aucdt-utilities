#!/usr/bin/env node

/**
 * PWA Icon Generator for Techbridge Poster Studio
 * Generates all required icon sizes from a master 1024x1024 image
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PUBLIC_DIR = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// TUC branding colors
const TUC_BURGUNDY = '#8B1A2F';
const TUC_TEAL = '#4A9B7F';
const BG_CREAM = '#FAF7F0';

/**
 * Generate master icon: 1024x1024 with TUC branding
 */
async function generateMasterIcon() {
  const size = 1024;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${TUC_BURGUNDY};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${TUC_TEAL};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${size}" height="${size}" fill="${BG_CREAM}"/>

      <!-- Gradient circle -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2.5}" fill="url(#grad)" opacity="0.9"/>

      <!-- Inner circle border -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2.5 - 20}" fill="none" stroke="${TUC_BURGUNDY}" stroke-width="8"/>

      <!-- Text: POSTER -->
      <text x="${size/2}" y="${size/2.2}" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="${BG_CREAM}">POSTER</text>

      <!-- Text: STUDIO -->
      <text x="${size/2}" y="${size/1.8}" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="${TUC_TEAL}">STUDIO</text>

      <!-- Corner accent -->
      <rect x="40" y="40" width="100" height="100" fill="none" stroke="${TUC_TEAL}" stroke-width="8" opacity="0.6"/>
      <rect x="${size-140}" y="${size-140}" width="100" height="100" fill="none" stroke="${TUC_BURGUNDY}" stroke-width="8" opacity="0.6"/>
    </svg>
  `;

  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(PUBLIC_DIR, 'icon-master-1024.png'));
    console.log('✓ Master icon (1024x1024) generated');
  } catch (err) {
    console.error('✗ Failed to generate master icon:', err);
    throw err;
  }
}

/**
 * Generate icons for all required sizes
 */
async function generateIconSizes() {
  const masterPath = path.join(PUBLIC_DIR, 'icon-master-1024.png');

  const sizes = [
    { name: 'icon-48.png', size: 48 },
    { name: 'icon-72.png', size: 72 },
    { name: 'icon-96.png', size: 96 },
    { name: 'icon-144.png', size: 144 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'maskable-192.png', size: 192 },
    { name: 'maskable-512.png', size: 512 },
  ];

  try {
    for (const { name, size } of sizes) {
      await sharp(masterPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
          background: { r: 250, g: 247, b: 240, alpha: 1 },
        })
        .png()
        .toFile(path.join(PUBLIC_DIR, name));
      console.log(`✓ Generated ${name} (${size}x${size})`);
    }
  } catch (err) {
    console.error('✗ Failed to generate icon sizes:', err);
    throw err;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Generating PWA icons for Techbridge Poster Studio...\n');
    await generateMasterIcon();
    await generateIconSizes();
    console.log('\n✓ All PWA icons generated successfully!');
  } catch (err) {
    console.error('\n✗ Icon generation failed:', err.message);
    process.exit(1);
  }
}

main();
