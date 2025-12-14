import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimisation des dépendances
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['framer-motion']
  },
  
  // Optimisation du build
  build: {
    // Minification agressive
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Segmentation du code pour meilleure mise en cache
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui': ['framer-motion', 'sonner', 'clsx', 'tailwind-merge'],
        }
      }
    },
    
    // Seuils pour les avertissements de taille
    chunkSizeWarningLimit: 500,
    
    // Compression Brotli et Gzip
    reportCompressedSize: true,
    
    // CSS minification
    cssMinify: true,
    
    // Optimiser les images avec rollup
    assetsInlineLimit: 4096,
  },
  
  // Serveur de développement
  server: {
    // Compression pendant le développement
    middlewareMode: false,
    fs: {
      allow: ['..']
    }
  }
});
