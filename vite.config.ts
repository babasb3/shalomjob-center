
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimisation de la configuration pour le build de production
  build: {
    outDir: 'dist',
    // Augmenter la limite d'avertissement de taille des chunks
    chunkSizeWarningLimit: 2000,
    // Désactiver le sourcemap en production pour réduire la taille
    sourcemap: false,
    // Optimisation des chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
        }
      }
    }
  },
  // Résoudre les problèmes de compatibilité d'environnement
  define: {
    // Supprimer le warning de process.env
    'process.env': {},
    global: {},
  }
}));
