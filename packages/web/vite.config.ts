import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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

export default defineConfig({
  plugins: [react(), md()],
  resolve: {
    alias: {
      "@kalani/lib": path.resolve(__dirname, '../lib/src')
    }
  },
})
