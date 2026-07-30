import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// 1. Generate 1200x630 OpenGraph Link Preview Banner
const ogBannerSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dark luxury background gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#141446" />
      <stop offset="50%" stop-color="#10103A" />
      <stop offset="100%" stop-color="#080821" />
    </linearGradient>

    <!-- Glowing accents -->
    <radialGradient id="cyanGlow" cx="200" cy="150" r="350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00C2C2" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#00C2C2" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="purpleGlow" cx="1000" cy="480" r="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6C68F4" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#6C68F4" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="greenGlow" cx="300" cy="450" r="250" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#12B857" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#12B857" stop-opacity="0" />
    </radialGradient>

    <!-- Badge gradient -->
    <linearGradient id="badgeGrad" x1="0" y1="0" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6C68F4" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#00C2C2" stop-opacity="0.1" />
    </linearGradient>

    <style>
      .title-main { font-family: 'Montserrat', 'Inter', 'Segoe UI', system-ui, sans-serif; font-weight: 900; font-size: 82px; fill: #FFFFFF; letter-spacing: -2px; }
      .title-[#00C2C2] { fill: #00C2C2; }
      .tagline { font-family: 'Montserrat', 'Inter', 'Segoe UI', system-ui, sans-serif; font-weight: 700; font-size: 26px; fill: #00C2C2; letter-spacing: 2px; }
      .badge-text { font-family: 'Montserrat', 'Inter', 'Segoe UI', system-ui, sans-serif; font-weight: 800; font-size: 22px; fill: #FFFFFF; letter-spacing: 3px; }
      .subtitle { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-weight: 600; font-size: 24px; fill: #E2E8F0; }
      .location { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-weight: 600; font-size: 18px; fill: #94A3B8; letter-spacing: 2px; }
    </style>
  </defs>

  <!-- Background base -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />

  <!-- Background glow circles -->
  <circle cx="200" cy="150" r="350" fill="url(#cyanGlow)" />
  <circle cx="1000" cy="480" r="400" fill="url(#purpleGlow)" />
  <circle cx="300" cy="450" r="250" fill="url(#greenGlow)" />

  <!-- Subtle grid pattern overlay -->
  <g opacity="0.05" stroke="#FFFFFF" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="630" />
    <line x1="300" y1="0" x2="300" y2="630" />
    <line x1="500" y1="0" x2="500" y2="630" />
    <line x1="700" y1="0" x2="700" y2="630" />
    <line x1="900" y1="0" x2="900" y2="630" />
    <line x1="1100" y1="0" x2="1100" y2="630" />
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="250" x2="1200" y2="250" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="550" x2="1200" y2="550" />
  </g>

  <!-- Card Frame border -->
  <rect x="25" y="25" width="1150" height="580" rx="24" fill="none" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2" />

  <!-- Main Content Layout -->
  <g transform="translate(100, 110)">

    <!-- Category Pill Badge -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="600" height="44" rx="22" fill="url(#badgeGrad)" stroke="#6C68F4" stroke-opacity="0.5" stroke-width="1.5" />
      <text x="24" y="29" class="badge-text">MARKETING DIGITAL &amp; ÉVÉNEMENTIEL</text>
    </g>

    <!-- Logo Mark & Text Group -->
    <g transform="translate(0, 90)">
      
      <!-- Forward One Symbol Icon -->
      <g transform="translate(0, 0) scale(1.6)">
        <!-- Top Slanted Parallelogram -->
        <path d="M 18 10 L 76 10 L 88 33 L 30 33 Z" fill="#5269C2" />
        <!-- Bottom Green Logo Mark -->
        <path d="M 36 41 L 64 41 L 77 63 L 52 63 L 42 86 L 28 63 Z" fill="#12B857" />
      </g>

      <!-- Brand Text -->
      <g transform="translate(185, 45)">
        <text class="title-main">Forward<tspan fill="#00C2C2">One</tspan></text>
        <text y="42" class="tagline">PROGRESS WITHOUT LIMITS.</text>
      </g>
    </g>

    <!-- Services list / Description -->
    <g transform="translate(0, 310)">
      <text class="subtitle">• Marketing Digital &amp; Stratégie Social Media</text>
      <text y="38" class="subtitle">• Sonorisation Professionnelle, Éclairage &amp; Écrans Géants LED</text>
    </g>

    <!-- Footer Location & Website -->
    <g transform="translate(0, 420)">
      <line x1="0" y1="-20" x2="1000" y2="-20" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1" />
      <text class="location">DOUALA &amp; YAOUNDÉ, CAMEROUN — www.forwardoneglobal.com</text>
    </g>

  </g>
</svg>
`;

// 2. Generate 800x800 Square Logo Preview for WhatsApp / Avatar Preview
const squareLogoSvg = `
<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="800" y2="800" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#141446" />
      <stop offset="100%" stop-color="#090924" />
    </linearGradient>

    <radialGradient id="centerGlow" cx="400" cy="400" r="350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6C68F4" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#00C2C2" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#141446" stop-opacity="0" />
    </radialGradient>

    <style>
      .brand-title { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; font-weight: 900; font-size: 76px; fill: #FFFFFF; letter-spacing: -2px; }
      .brand-tagline { font-family: 'Montserrat', 'Inter', system-ui, sans-serif; font-weight: 700; font-size: 24px; fill: #00C2C2; letter-spacing: 4px; }
      .brand-sub { font-family: 'Inter', system-ui, sans-serif; font-weight: 600; font-size: 18px; fill: #94A3B8; letter-spacing: 2px; }
    </style>
  </defs>

  <rect width="800" height="800" fill="url(#bgGrad)" />
  <circle cx="400" cy="400" r="350" fill="url(#centerGlow)" />

  <!-- Outer frame border -->
  <rect x="30" y="30" width="740" height="740" rx="36" fill="none" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2" />

  <!-- Center emblem -->
  <g transform="translate(230, 160) scale(3.4)">
    <!-- Top Slanted Parallelogram -->
    <path d="M 18 10 L 76 10 L 88 33 L 30 33 Z" fill="#5269C2" />
    <!-- Bottom Green Logo Mark -->
    <path d="M 36 41 L 64 41 L 77 63 L 52 63 L 42 86 L 28 63 Z" fill="#12B857" />
  </g>

  <!-- Typography -->
  <g transform="translate(400, 560)">
    <text text-anchor="middle" class="brand-title">Forward<tspan fill="#00C2C2">One</tspan></text>
    <text y="45" text-anchor="middle" class="brand-tagline">PROGRESS WITHOUT LIMITS.</text>
    <text y="100" text-anchor="middle" class="brand-sub">CAMEROUN — DOUALA &amp; YAOUNDÉ</text>
  </g>
</svg>
`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate og-image.png (1200x630)
  await sharp(Buffer.from(ogBannerSvg))
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('Generated public/og-image.png (1200x630)');

  // Generate og-logo.png (800x800)
  await sharp(Buffer.from(squareLogoSvg))
    .png()
    .toFile(path.join(publicDir, 'og-logo.png'));
  console.log('Generated public/og-logo.png (800x800)');

  // Generate logo-512.png (512x512)
  await sharp(Buffer.from(squareLogoSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo-512.png'));
  console.log('Generated public/logo-512.png (512x512)');

  // Generate logo-192.png
  await sharp(Buffer.from(squareLogoSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'logo-192.png'));
  console.log('Generated public/logo-192.png (192x192)');
}

main().catch(err => {
  console.error('Error generating OG images:', err);
  process.exit(1);
});
