/**
 * Converts an RGB color value to HSL.
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

/**
* Hex to RGB helper
*/
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

export const processImage = (imageSrc, options) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            const {
                sensitivity = 90, // Default increased to 90
                replaceRed,
                replaceGreen,
                redResultColor = '#4169E1',
                greenResultColor = '#ffffff',
                thickness = 0.5, // Default 0.5
                noiseFilter = true,
                checkConnectivity = true
            } = options;

            // MASK STATES:
            // 0: Ignore
            // 1: Red Candidate
            // 2: Green Candidate
            // 3: Yellow SEED
            // 4: Red CONFIRMED
            // 5: Green CONFIRMED
            const mask = new Uint8Array(width * height);
            const range = 10 + (sensitivity / 100) * 30;
            const seeds = [];

            // PASS 1: Detection
            for (let i = 0; i < width * height; i++) {
                const idx = i * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                // const a = data[idx + 3];

                const [h, s, l] = rgbToHsl(r, g, b);
                const hDeg = h * 360;

                // Ignore dark/black background
                if (s < 0.1 || l < 0.1) continue;

                // Check Yellow (Main Route) - roughly Hue 40-60
                // Needs to be reasonably bright
                if (checkConnectivity && Math.abs(hDeg - 50) < 15 && l > 0.3) {
                    mask[i] = 3;
                    seeds.push(i);
                }
                // Check Red
                else if (replaceRed && (hDeg < range || hDeg > 360 - range)) {
                    mask[i] = 1;
                }
                // Check Green
                else if (replaceGreen && Math.abs(hDeg - 120) < range) {
                    mask[i] = 2;
                }
            }

            // PASS 2: Connectivity (Flood Fill)
            if (!checkConnectivity) {
                for (let i = 0; i < mask.length; i++) {
                    if (mask[i] === 1) mask[i] = 4;
                    if (mask[i] === 2) mask[i] = 5;
                }
            } else {
                const stack = seeds;

                while (stack.length > 0) {
                    const i = stack.pop();
                    const neighbors = [
                        i - width - 1, i - width, i - width + 1,
                        i - 1, i + 1,
                        i + width - 1, i + width, i + width + 1
                    ];

                    for (const ni of neighbors) {
                        if (ni >= 0 && ni < mask.length) {
                            const val = mask[ni];
                            if (val === 1) { // Red Candidate
                                mask[ni] = 4; // Confirmed
                                stack.push(ni);
                            } else if (val === 2) { // Green Candidate
                                mask[ni] = 5; // Confirmed
                                stack.push(ni);
                            } else if (val === 3) {
                                // Already seed
                            }
                        }
                    }
                }
            }

            // PASS 3: Dilation (Thickness)
            let finalMask = mask;
            if (thickness > 0) {
                const dilatedMask = new Uint8Array(width * height);
                // Interpret 0.5 as "Cross" dilation (less heavy), and >= 1 as "Square" dilation
                const isFractional = thickness < 1;
                const radius = Math.max(1, Math.round(thickness)); // At least 1 for loop, but logic changes

                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const i = y * width + x;
                        const val = mask[i];
                        if (val === 4 || val === 5) {
                            // If fractional (0.5), only dilate to direct cross neighbors (up, down, left, right)
                            // If full (>=1), dilate to full square box

                            if (isFractional) {
                                // Cross shape
                                const neighbors = [
                                    i - width, // up
                                    i + width, // down
                                    i - 1,     // left
                                    i + 1      // right
                                ];
                                for (const ni of neighbors) {
                                    if (ni >= 0 && ni < dilatedMask.length && dilatedMask[ni] === 0) {
                                        dilatedMask[ni] = val;
                                    }
                                }
                                // Also keep self
                                if (dilatedMask[i] === 0) dilatedMask[i] = val;
                            } else {
                                // Square shape (full loop)
                                for (let dy = -radius; dy <= radius; dy++) {
                                    for (let dx = -radius; dx <= radius; dx++) {
                                        const ny = y + dy;
                                        const nx = x + dx;
                                        if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                                            const ni = ny * width + nx;
                                            if (dilatedMask[ni] === 0) {
                                                dilatedMask[ni] = val;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                finalMask = dilatedMask;
            }

            // PASS 4: Rendering
            const redRGB = hexToRgb(redResultColor);
            const greenRGB = hexToRgb(greenResultColor);

            for (let i = 0; i < width * height; i++) {
                const val = finalMask[i];
                if (val === 4 || val === 5) {
                    const idx = i * 4;
                    const target = val === 4 ? redRGB : greenRGB;

                    data[idx] = target.r;
                    data[idx + 1] = target.g;
                    data[idx + 2] = target.b;
                    data[idx + 3] = 255;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL());
        };
        img.onerror = reject;
        img.src = imageSrc;
    });
};
