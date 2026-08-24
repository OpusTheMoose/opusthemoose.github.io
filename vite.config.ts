import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        engine: resolve(__dirname, 'src/pages/engine.html'),
        gamejam: resolve(__dirname, 'src/pages/gamejam.html'),
        graphicsfinal: resolve(__dirname, 'src/pages/graphicsfinal.html'),
        mandelbrot: resolve(__dirname, 'src/pages/mandelbrot.html'),
        portfolio: resolve(__dirname, 'src/pages/portfolio.html'),
      },
    },
  },
})