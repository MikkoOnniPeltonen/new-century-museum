/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Preloads the Latin subsets of the two variable fonts from index.html. Without this the
 * browser only discovers them after the app has rendered text, which delays the intro.
 */
function preloadFonts(): Plugin {
  let base = '/'
  return {
    name: 'century-museum:preload-fonts',
    apply: 'build',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, context) {
        return Object.keys(context.bundle ?? {})
          .filter((file) => /(inter|cormorant-garamond)-latin-wght-normal-[\w-]+\.woff2$/.test(file))
          .map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', href: `${base}${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
            injectTo: 'head' as const,
          }))
      },
    },
  }
}

// VITE_BASE is set by the GitHub Pages workflow (e.g. "/new-century-museum/").
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss(), preloadFonts()],
  build: {
    rolldownOptions: {
      output: {
        // Framework code changes rarely, so it gets its own long-cached chunks.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
