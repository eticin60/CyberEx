// PNG icon oluşturmak için Node.js script
// sharp kütüphanesi gerekli: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSVG = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#000000"/>
  <g stroke="#00ffff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 30 64 Q 30 30, 64 30" />
    <path d="M 30 64 Q 30 98, 64 98" />
    <rect x="50" y="50" width="28" height="28" rx="4" />
    <path d="M 50 50 L 50 40 Q 50 30, 64 30" />
    <circle cx="64" cy="64" r="3" fill="#00ffff" />
    <line x1="78" y1="50" x2="98" y2="50" />
    <circle cx="98" cy="50" r="3" fill="#00ffff" />
    <line x1="78" y1="64" x2="98" y2="64" />
    <circle cx="98" cy="64" r="3" fill="#00ffff" />
    <line x1="78" y1="78" x2="98" y2="78" />
    <circle cx="98" cy="78" r="3" fill="#00ffff" />
  </g>
</svg>
`;

const sizes = [16, 32, 48, 128];
const iconsDir = path.join(__dirname, '../src/icons');

async function generateIcons() {
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log('PNG icon dosyaları oluşturuluyor...');

  for (const size of sizes) {
    try {
      await sharp(Buffer.from(iconSVG))
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon${size}.png`));
      console.log(`✓ icon${size}.png oluşturuldu`);
    } catch (error) {
      console.error(`✗ icon${size}.png oluşturulamadı:`, error.message);
    }
  }

  console.log('\n✅ Tüm PNG icon dosyaları oluşturuldu!');
}

generateIcons().catch(console.error);

