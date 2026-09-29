import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'sans-serif'], // overrides default sans
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: { host: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-charts': ['recharts'],
          'vendor-excel': ['xlsx'],
          'vendor-icons': ['react-icons', 'lucide-react'],
          'vendor-utils': ['axios', 'moment', 'validator']
        }
      }
    }
  }
})
