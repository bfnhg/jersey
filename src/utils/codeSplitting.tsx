/**
 * Configuration du Code Splitting pour optimiser le chargement
 * Permet le lazy loading des composants lourds
 */

import { lazy, Suspense, ReactNode } from 'react';

// Chargement lazy des composants lourds
export const HeroWaves = lazy(() => import('../components/HeroWaves'));
export const AnimatedTestimonials = lazy(() => import('../components/ui/AnimatedTestimonials'));
export const CardJersey = lazy(() => import('../components/CardJersey'));

// Component de fallback pendant le chargement
interface LoadingFallbackProps {
  title?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ title = 'Chargement...' }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-950">
    <div className="text-center space-y-4">
      <div className="animate-spin">
        <div className="h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"></div>
      </div>
      <p className="text-white text-lg font-semibold">{title}</p>
    </div>
  </div>
);

// HOC pour wrapper les composants lazy avec Suspense
export function withLazySuspense<P extends object>(
  Component: React.LazyExoticComponent<React.ComponentType<P>>,
  fallback?: ReactNode
) {
  return (props: P) => (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
}
