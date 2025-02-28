import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button from './elements/Button'
import { ReactNode } from 'react'
import ChainImg from './ChainImg'

export default function Connect({ 
  label = <>Connect</>,
  short = false,
  className
}: { 
  label?: ReactNode
  short?: boolean
  className?: string 
}) {
  return <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated')
        return (() => {
          if (!connected) {
            return <Button 
              onClick={openConnectModal} 
              type="button" 
              h="secondary"
              className={`border-transparent bg-black ${className}`}>
              {label}
            </Button>
          }
          if (chain.unsupported) {
            return (
              <Button h="secondary" onClick={openChainModal} type="button">
                Wrong network
              </Button>
            )
          }
          return (
            <div className="flex items-start sm:items-center gap-3 sm:gap-6 sm:gap-4">
              <Button
                onClick={openChainModal}
                h="secondary"
                type="button"
                className={`flex items-center gap-3 border-transparent bg-black ${className}`}
              >
                <ChainImg chainId={chain.id} size={24} />
                {!short && chain.name}
              </Button>
              <Button 
                className={`border-transparent bg-black ${className}`} 
                h="secondary" 
                onClick={openAccountModal} 
                type="button">
                {account.displayName}
                {!short && account.displayBalance
                  ? ` (${account.displayBalance})`
                  : ''}
              </Button>
            </div>
          )
        })()
      }}
    </ConnectButton.Custom>
}
