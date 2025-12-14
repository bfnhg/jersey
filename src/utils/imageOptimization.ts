/**
 * Utilitaires pour la compression et optimisation des images
 * À utiliser avec les outils de build ou lors du traitement des images
 */

interface ImageOptimizationConfig {
  // Formats à générer
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  // Qualité de compression (1-100)
  quality: number;
  // Tailles responsive à générer
  sizes: number[];
  // Ratio d'aspect à maintenir
  aspectRatio?: string;
}

/**
 * Configuration par défaut pour les images de produits
 */
export const PRODUCT_IMAGE_CONFIG: ImageOptimizationConfig = {
  formats: ['webp', 'jpeg'],
  quality: 85,
  sizes: [300, 600, 900], // Mobile, Tablet, Desktop
  aspectRatio: '1/1'
};

/**
 * Configuration pour les images hero/bannière
 */
export const HERO_IMAGE_CONFIG: ImageOptimizationConfig = {
  formats: ['webp', 'jpeg'],
  quality: 80,
  sizes: [375, 768, 1200, 1920],
  aspectRatio: '16/9'
};

/**
 * Configuration pour les thumbnails
 */
export const THUMBNAIL_IMAGE_CONFIG: ImageOptimizationConfig = {
  formats: ['webp', 'jpeg'],
  quality: 75,
  sizes: [150, 300],
  aspectRatio: '1/1'
};

/**
 * Générateur de nom de fichier optimisé
 * Usage: 
 *   getOptimizedImagePath('my-image.jpg', 'webp', 600)
 *   => 'my-image-600w.webp'
 */
export function getOptimizedImagePath(
  filename: string,
  format: string,
  width?: number
): string {
  const [name] = filename.split('.');
  const sizeStr = width ? `-${width}w` : '';
  return `${name}${sizeStr}.${format}`;
}

/**
 * Génère un srcSet pour les images responsives
 * Usage:
 *   generateSrcSet('image.jpg', [300, 600, 900])
 */
export function generateSrcSet(
  filename: string,
  sizes: number[],
  format: string = 'webp'
): string {
  return sizes
    .map(size => `${getOptimizedImagePath(filename, format, size)} ${size}w`)
    .join(', ');
}

/**
 * Obtient les recommandations d'optimisation pour une image
 */
export function getImageOptimizationTips(): string[] {
  return [
    '✅ Utilisez des formats modernes: WebP et AVIF',
    '✅ Générez plusieurs tailles pour les breakpoints',
    '✅ Compressez les images: 70-85% de qualité',
    '✅ Utilisez lazy loading natif: loading="lazy"',
    '✅ Optimisez les métadonnées (EXIF, etc.)',
    '✅ Fournissez des dimensions explicites (aspect ratio)',
    '✅ Utilisez srcset pour les écrans haute densité',
    '✅ Servez WebP en priorité avec fallback JPEG'
  ];
}

/**
 * Configuration pour la compression avec ImageMagick/Sharp
 * À utiliser dans votre pipeline de build
 */
export const COMPRESSION_SETTINGS = {
  webp: {
    quality: 85,
    alphaQuality: 90,
    method: 6 // Slow but better compression
  },
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true
  },
  png: {
    compressionLevel: 9,
    adaptiveFiltering: true
  },
  avif: {
    quality: 75,
    effort: 9 // Slow but best compression
  }
};

export default {
  PRODUCT_IMAGE_CONFIG,
  HERO_IMAGE_CONFIG,
  THUMBNAIL_IMAGE_CONFIG,
  getOptimizedImagePath,
  generateSrcSet,
  getImageOptimizationTips,
  COMPRESSION_SETTINGS
};
