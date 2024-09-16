(BigInt.prototype as any)['toJSON'] = function () {
  return this.toString()
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Providers from './providers.tsx'
import App from './App.tsx'
import { Toaster } from './components/shadcn/sonner'
import '@rainbow-me/rainbowkit/styles.css'
import 'odometer/themes/odometer-theme-minimal.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
    <Toaster visibleToasts={1} />
  </StrictMode>,
)
