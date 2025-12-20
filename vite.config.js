import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/CyberEx/', // GitHub repository adı
  build: {
    // Minify code
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Console.log'ları kaldır
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false // Yorumları kaldır
      }
    },
    
    // Source maps'i production'da kaldır
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Dosya isimlerini obfuscate et
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
        
        // Manual chunks - kodu parçalara böl
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor': ['chart.js']
        }
      }
    }
  },
  
  // Environment variables
  envPrefix: 'VITE_',
  
  // Server configuration
  server: {
    port: 3000,
    strictPort: true
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@js': resolve(__dirname, './js')
    }
  }
});
