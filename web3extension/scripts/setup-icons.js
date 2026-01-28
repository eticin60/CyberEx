const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const srcLogo = path.join(rootDir, '../cyberex-logo.png');
const targetDir = path.join(rootDir, 'src/icons');
const targetLogo = path.join(targetDir, 'logo.png');
const distIconsDir = path.join(rootDir, 'dist/icons');

// 1. Copy Logo
console.log('1. Logo kopyalanıyor...');
if (fs.existsSync(srcLogo)) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.copyFileSync(srcLogo, targetLogo);
    console.log('✅ Logo başarıyla kopyalandı:', targetLogo);
} else {
    console.error('❌ Kaynak logo bulunamadı:', srcLogo);
    process.exit(1);
}

// 2. Run Generation
console.log('\n2. İkonlar oluşturuluyor...');
try {
    execSync('node scripts/generate-icons-png.js', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
    console.error('❌ İkon oluşturma hatası:', error.message);
    process.exit(1);
}

// 3. Copy to Dist
console.log('\n3. Dist klasörüne taşınıyor...');
if (!fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir, { recursive: true });
}

const sizes = [16, 32, 48, 128];
sizes.forEach(size => {
    const iconName = `icon${size}.png`;
    const srcIcon = path.join(targetDir, iconName);
    const distIcon = path.join(distIconsDir, iconName);

    if (fs.existsSync(srcIcon)) {
        fs.copyFileSync(srcIcon, distIcon);
        console.log(`✅ ${iconName} -> dist/icons`);
    } else {
        console.warn(`⚠️ ${iconName} oluşturulmamış!`);
    }
});

console.log('\n✨ İşlem tamamlandı! Lütfen eklentiyi yenileyin.');
