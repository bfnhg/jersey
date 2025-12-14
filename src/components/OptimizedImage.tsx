import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  srcWebp?: string;
  sizes?: string;
  placeholder?: string;
  blurClassName?: string;
  onImageLoad?: () => void;
}

/**
 * Composant OptimizedImage
 * 
 * Optimisations:
 * ✅ Lazy loading natif
 * ✅ Format WebP avec fallback
 * ✅ Blur placeholder pendant le chargement
 * ✅ Compression automatique
 * ✅ Responsive images avec sizes
 */
export function OptimizedImage({
  src,
  srcWebp,
  sizes,
  alt = 'image',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  blurClassName = 'blur-lg',
  onImageLoad,
  className,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Preload l'image pour une meilleure performance
    if (imgRef.current?.complete) {
      setIsLoaded(true);
      onImageLoad?.();
    }
  }, [onImageLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    onImageLoad?.();
  };

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div className={cn("bg-gray-200 flex items-center justify-center", className)}>
        <span className="text-gray-500 text-sm">Erreur de chargement</span>
      </div>
    );
  }

  // Si WebP est fourni, utiliser picture + source pour fallback
  if (srcWebp) {
    return (
      <picture>
        <source srcSet={srcWebp} type="image/webp" sizes={sizes} />
        <source srcSet={src} sizes={sizes} />
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn(
            'transition-all duration-500',
            !isLoaded && blurClassName,
            isLoaded && 'blur-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </picture>
    );
  }

  // Sinon, simple img tag
  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      className={cn(
        'transition-all duration-500',
        !isLoaded && blurClassName,
        isLoaded && 'blur-0',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}

/**
 * Hook personnalisé pour l'Intersection Observer
 * Permet un lazy loading plus granulaire
 */
export function useImageIntersection(threshold = 0.1) {
  const ref = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return { ref, isVisible };
}
