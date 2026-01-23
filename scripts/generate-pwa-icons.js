const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, '../cyberex-logo.png');
const outputDir = path.join(__dirname, '../icons');

async function generatePWAIcons() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Generating PWA Icons...');

    const sizes = [192, 512];

    for (const size of sizes) {
        try {
            await sharp(sourceIcon)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 10, g: 10, b: 20, alpha: 1 } // Matches the dark theme
                })
                .flatten({ background: { r: 10, g: 10, b: 20 } }) // Ensure no transparency
                .toFile(path.join(outputDir, `icon-${size}x${size}.png`));

            console.log(`✓ Generated ${size}x${size} icon`);
        } catch (err) {
            console.error(`✗ Failed to generate ${size}x${size} icon:`, err.message);
        }
    }

    try {
        await sharp(sourceIcon)
            .resize(32, 32)
            .toFile(path.join(outputDir, 'favicon-32x32.png'));
        console.log('✓ Generated 32x32 favicon');
    } catch (err) {
        console.error('✗ Failed to generate favicon:', err.message);
    }

    console.log('\n✅ PWA icons created successfully in /icons directory');
}

generatePWAIcons();
