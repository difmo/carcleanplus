/**
 * Helper to create an HTML Image element from a source URL
 */
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Crops and resizes image using HTML5 Canvas
 * @param {string} imageSrc - Source image data URL or object URL
 * @param {Object} pixelCrop - Pixel crop coordinates from react-easy-crop { x, y, width, height }
 * @param {number} rotation - Rotation in degrees (default 0)
 * @param {number} maxDimension - Max width or height constraint (e.g., 1200)
 * @param {string} format - Output format 'image/jpeg' or 'image/webp'
 * @param {number} quality - Compression quality between 0 and 1 (default 0.88)
 * @returns {Promise<{ dataUrl: string, width: number, height: number, sizeKB: number }>}
 */
export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  maxDimension = 1200,
  format = 'image/jpeg',
  quality = 0.88
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to match bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to a central point on image to allow rotating around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  // Extract the cropped image data
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    throw new Error('Cropped canvas 2D context not available');
  }

  // Calculate scaled dimensions if maxDimension is specified
  let targetWidth = Math.round(pixelCrop.width);
  let targetHeight = Math.round(pixelCrop.height);

  if (maxDimension && (targetWidth > maxDimension || targetHeight > maxDimension)) {
    if (targetWidth >= targetHeight) {
      const scale = maxDimension / targetWidth;
      targetWidth = maxDimension;
      targetHeight = Math.round(targetHeight * scale);
    } else {
      const scale = maxDimension / targetHeight;
      targetHeight = maxDimension;
      targetWidth = Math.round(targetWidth * scale);
    }
  }

  // Set final cropped canvas dimensions
  croppedCanvas.width = targetWidth;
  croppedCanvas.height = targetHeight;

  // Draw cropped image onto destination canvas with high quality smoothing
  croppedCtx.imageSmoothingEnabled = true;
  croppedCtx.imageSmoothingQuality = 'high';

  croppedCtx.drawImage(
    canvas,
    Math.round(pixelCrop.x),
    Math.round(pixelCrop.y),
    Math.round(pixelCrop.width),
    Math.round(pixelCrop.height),
    0,
    0,
    targetWidth,
    targetHeight
  );

  const dataUrl = croppedCanvas.toDataURL(format, quality);

  // Calculate approximate file size in KB from base64
  const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
  const sizeKB = Math.round((base64Length * 3) / 4 / 1024);

  return {
    dataUrl,
    width: targetWidth,
    height: targetHeight,
    sizeKB
  };
}
