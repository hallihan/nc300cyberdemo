import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Emits build/bundle.js + build/bundle.css, the exact paths index.html and
// server.js already serve, so neither has to change.
//
// format: 'iife' matters — index.html loads the bundle with a plain
// <script defer src>, not type="module". An ES-module output would silently
// fail to execute there.
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'build',
    emptyOutDir: false,
    cssCodeSplit: false,
    // keep the output readable: students are expected to "view source" here
    minify: false,
    rollupOptions: {
      input: 'src/main.js',
      output: {
        format: 'iife',
        entryFileNames: 'bundle.js',
        assetFileNames: 'bundle.[ext]'
      }
    }
  }
});
