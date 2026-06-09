import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // All /fred-api/* requests are proxied from Node.js → FRED server
      // This bypasses browser-level geo/CORS blocks on api.stlouisfed.org
      '/fred-api': {
        target: 'https://api.stlouisfed.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fred-api/, '/fred'),
        secure: true,
      },
    },
  },
})
