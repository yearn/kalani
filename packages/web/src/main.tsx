// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any)['toJSON'] = function () {
  return this.toString()
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Providers from './providers.tsx'
import App from './App.tsx'
import { Toaster } from './components/shadcn/sonner'
import { registerSW } from 'virtual:pwa-register'

import '@rainbow-me/rainbowkit/styles.css'
import 'odometer/themes/odometer-theme-minimal.css'
import './index.css'

registerSW({
  onNeedRefresh() {
    console.log('New content available. Refresh the page to update.')
  },
  onOfflineReady() {
    console.log('App is ready to work offline.')
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
    <Toaster visibleToasts={1} />
  </StrictMode>,
)
