/**
 * Fichier de configuration pour l'optimisation des performances
 * À importer dans main.tsx pour activer les optimisations
 */

/**
 * Active les Web Vitals Monitoring
 * Permet de tracker les Core Web Vitals (LCP, FID, CLS)
 */
export function initWebVitalsMonitoring() {
  // LCP - Largest Contentful Paint
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('LCP:', {
        element: entry.element?.tagName,
        startTime: entry.startTime,
        renderTime: entry.renderTime,
      });
    }
  });
  observer.observe({ entryTypes: ['largest-contentful-paint'] });

  // CLS - Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log('CLS Update:', clsValue);
      }
    }
  });
  clsObserver.observe({ type: 'layout-shift', buffered: true });

  // FID - First Input Delay
  const fidObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('FID:', {
        processingStart: entry.processingStart,
        duration: entry.duration,
      });
    }
  });
  fidObserver.observe({ type: 'first-input', buffered: true });
}

/**
 * Précharge les images critiques pour améliorer LCP
 */
export function preloadCriticalImages(urls: string[]) {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Utilise le requestIdleCallback pour les tâches non-critiques
 */
export function deferNonCriticalWork(callback: () => void, timeout = 2000) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, timeout);
  }
}

/**
 * Optimise le rendu des grandes listes avec virtualisation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Throttle pour les événements fréquents (scroll, resize)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      func(...args);
      lastCall = now;
    }
  };
}

/**
 * Initialise tout
 */
export function initPerformanceOptimizations() {
  // Monitoring des Web Vitals
  if (process.env.NODE_ENV === 'development') {
    initWebVitalsMonitoring();
  }

  // Précharge les images critiques (les premières images des produits)
  preloadCriticalImages([
    '/img1.jpeg',
    '/mailloexterier.jpg',
  ]);

  // Traitement des tâches non-critiques
  deferNonCriticalWork(() => {
    console.log('Application entièrement optimisée!');
  });

  // Désactive les images inutiles en dev
  if (process.env.NODE_ENV === 'production') {
    // Cache les impressions console
    console.log = () => {};
  }
}

export default {
  initWebVitalsMonitoring,
  preloadCriticalImages,
  deferNonCriticalWork,
  debounce,
  throttle,
  initPerformanceOptimizations,
};
