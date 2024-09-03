import {
  getDefaultConfig,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'

import { 
  injectedWallet, 
  frameWallet, 
  metaMaskWallet, 
  walletConnectWallet, 
  rainbowWallet, 
  coinbaseWallet, 
  safeWallet 
} from '@rainbow-me/rainbowkit/wallets'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { chains } from './lib/chains'
import { secondary } from '../tailwind.config'

const config = getDefaultConfig({
  appName: import.meta.env.VITE_WALLETCONNECT_PROJECT_NAME ?? 'appName',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? 'projectId',
  ssr: true,
  chains: chains as any,
  wallets: [{
    groupName: 'Popular',
    wallets: [
      injectedWallet,
      frameWallet,
      metaMaskWallet,
      walletConnectWallet,
      rainbowWallet,
      coinbaseWallet,
      safeWallet
    ]
  }]
})

const queryClient = new QueryClient()

const theme = midnightTheme({
  accentColor: secondary[400],
  accentColorForeground: 'black',
})

export default function Providers ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
