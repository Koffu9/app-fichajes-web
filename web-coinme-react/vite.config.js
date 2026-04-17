import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    proxy: {
        '/api': 'http://localhost:3000'
    }
  },
  preview: {
    proxy: {
        '/api': 'http://localhost:3000'
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo_escudo.png'],
      manifest: {
        name: 'COIMNE Fichajes',
        short_name: 'Fichajes',
        description: 'Sistema de fichajes del Colegio Oficial de Ingenieros de Minas del Noroeste de España',
        theme_color: '#264653',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/login',
        icons: [
          {
            src: 'logo_escudo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo_escudo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})