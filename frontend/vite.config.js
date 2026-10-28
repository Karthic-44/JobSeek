import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In development the API is proxied, so the browser sees one origin and the
// login cookie just works. Point VITE_API_PROXY at your backend if it is not on :8080.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': process.env.VITE_API_PROXY || 'http://localhost:8080',
    },
  },
}))
