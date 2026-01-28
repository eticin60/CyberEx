// PNG icon oluşturmak için Node.js script
// sharp kütüphanesi gerekli: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const sizes = [16, 32, 48, 128];
const iconsDir = path.join(__dirname, '../src/icons');
const sourceImage = path.join(iconsDir, 'logo.png');

async function generateIcons() {
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  if (!fs.existsSync(sourceImage)) {
    console.error('Hata: Kaynak logo bulunamadı:', sourceImage);
    return;
  }

  console.log('PNG icon dosyaları logo.png üzerinden oluşturuluyor...');

  for (const size of sizes) {
    try {
      await sharp(sourceImage)
        .trim(50)
        .resize({
          width: size,
          height: size,
          fit: 'cover',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
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

