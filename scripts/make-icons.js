const fs = require('fs');
const path = require('path');

// Ensure directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Minimal valid PNG buffer
const pngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSU85ErkJggg==',
  'base64'
);

// High quality SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="#FF5733"/>
  <circle cx="256" cy="256" r="180" fill="#FFF9F2"/>
  <text x="256" y="290" font-size="160" font-family="sans-serif" font-weight="bold" fill="#FF5733" text-anchor="middle">اقرأ</text>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), pngBuffer);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), pngBuffer);
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);

console.log('PWA icons created in public/icons/');
