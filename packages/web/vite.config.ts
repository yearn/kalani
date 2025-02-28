import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

function md(): Plugin {
  return {
    name: 'vite-plugin-import-markdown',
    transform(code: string, id: string) {
      if (id.endsWith('.md')) {
        const content = code.trim()
        return {
          code: `export default ${JSON.stringify(content)};`,
          map: null
        }
      }
    }
  }
}

const pwa = VitePWA({
  registerType: 'autoUpdate',
  devOptions: {
    enabled: process.env.NODE_ENV === 'development'
  },
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    name: 'Kalani',
    short_name: 'Kalani',
    description: 'Yearn vault super center. Build, Automate, Earn. Get your users the best yields in DeFi',
    theme_color: '#09090c',
    background_color: '#09090c',
    display: 'standalone',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
})

export default defineConfig({
  plugins: [react(), md(), pwa],
  resolve: {
    alias: {
      '@kalani/lib': path.resolve(__dirname, '../lib/src')
    }
  },
})
