import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['flag.png', 'flag.svg', 'vite.svg'],
      manifest: {
        name: 'SKSSF Muttipadi Quiz',
        short_name: 'SKSSF Quiz',
        description: 'Official Online Quiz Portal for SKSSF Muttipadi Unit',
        theme_color: '#0F8A5F',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'flag.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'flag.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
