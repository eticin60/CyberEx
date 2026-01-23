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
            // Safe zone (80% of total size) to prevent clipping and ensure centering
            const padding = Math.round(size * 0.1); // 10% padding on each side
            const innerSize = size - (padding * 2);

            await sharp(sourceIcon)
                .resize(innerSize, innerSize, {
                    fit: 'contain',
                    background: { r: 33, g: 33, b: 33, alpha: 1 }
                })
                .extend({
                    top: padding,
                    bottom: padding,
                    left: padding,
                    right: padding,
                    background: { r: 33, g: 33, b: 33 }
                })
                .flatten({ background: { r: 33, g: 33, b: 33 } })
                .toFile(path.join(outputDir, `icon-${size}x${size}.png`));

            console.log(`✓ Generated ${size}x${size} icon with safe-zone`);
        } catch (err) {
            console.error(`✗ Failed to generate ${size}x${size} icon:`, err.message);
        }
    }

    // Generate transparent Favicon
    try {
        await sharp(sourceIcon)
            .resize(32, 32, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent
            })
            .toFile(path.join(outputDir, 'favicon-32x32.png'));
        console.log('✓ Generated 32x32 transparent favicon');
    } catch (err) {
        console.error('✗ Failed to generate favicon:', err.message);
    }

    console.log('\n✅ PWA icons created successfully in /icons directory');
}

generatePWAIcons();
