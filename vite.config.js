import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/work': { target: 'http://localhost:8080', changeOrigin: true },
      '/bookclub': { target: 'http://localhost:8080', changeOrigin: true },
      '/auth': { target: 'http://localhost:8080', changeOrigin: true },
      '/comments': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})