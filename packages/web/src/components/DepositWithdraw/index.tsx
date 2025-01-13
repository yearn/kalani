import { EvmAddress } from '@kalani/lib/types'
import { cn } from '../../lib/shadcn'
import Action from './Action'
import { useParameters, useSuspendedParameters } from './useParameters'
import { Suspense, useEffect, useMemo, useState } from 'react'
import Skeleton from '../Skeleton'
import bmath, { priced } from '@kalani/lib/bmath'
import Odometer from 'react-odometerjs'
import { useAccount } from 'wagmi'
import { useVaultBalance } from './useVaultBalance'
import FlyInFromBottom from '../motion/FlyInFromBottom'
import InputLabel from './InputLabel'
import InputPanel from './InputPanel'
import { formatUnits } from 'viem'
import Base from './Base'

function SwitchOption({ selected, onClick, children }: { selected: boolean, onClick: () => void, children: React.ReactNode }) {
  return <div className="relative">
    <div className="px-6 py-1 invisible">{children}</div>

    <div className="absolute z-0 inset-0">
      {selected && <FlyInFromBottom _key="switchOptionBg">
        <div className="px-6 py-1 bg-secondary-400 rounded-full text-transparent">{children}</div>
      </FlyInFromBottom>}
    </div>

    <div data-selected={selected} onClick={onClick} className={cn(`
      absolute z-10 inset-0 px-6 py-1
      text-neutral-400 hover:text-neutral-50 active:text-neutral-400 
      bg-transparent hover:bg-neutral-900 active:bg-neutral-900
      data-[selected=true]:!text-neutral-900
      data-[selected=true]:!bg-transparent
      rounded-full cursor-pointer`)}>
      {children}
    </div>
  </div>
}

function Switch() {
  const { mode, setMode, setAmount } = useParameters()
  return <div className="p-1 w-min flex items-center gap-6 bg-black rounded-full">
    <SwitchOption selected={mode === 'deposit'} onClick={() => { setMode('deposit'); setAmount('') }}>Deposit</SwitchOption>
    <SwitchOption selected={mode === 'withdraw'} onClick={() => { setMode('withdraw'); setAmount('') }}>Withdraw</SwitchOption>
  </div>
}

function useAssetUnlocker({ chainId, vault, wallet }: { chainId: number, vault: EvmAddress, wallet: EvmAddress }) {
  const interval = 2_000
  const { assets, apr } = useVaultBalance({ chainId, vault, wallet })
  const [unlocked, setUnlocked] = useState(assets)

  useEffect(() => {
    let tick = 1
    const handle = setInterval(() => {
      const delta = bmath.mulb(assets, apr * (interval * tick) / (365 * 24 * 60 * 60 * 1000))
      setUnlocked(assets + delta)
      tick++
    }, interval)
    return () => clearInterval(handle)
  }, [assets, apr, setUnlocked])

  const result = useMemo(() => unlocked > assets ? unlocked : assets, [unlocked, assets])
  return { interval, assets: result }
}

function VaultBalance() {
  const { chainId, vault, wallet } = useSuspendedParameters()
  const { shares, decimals, assetPrice, symbol } = useVaultBalance({ chainId: chainId!, vault: vault!, wallet: wallet! })
  const { interval: unlockInterval, assets: unlockedAssets1e18 } = useAssetUnlocker({ chainId: chainId!, vault: vault!, wallet: wallet! })
  const unlockedAssets = useMemo(() => bmath.div(unlockedAssets1e18, 10n ** BigInt(decimals)), [unlockedAssets1e18, decimals])

  return <div className={cn(
    'p-6 flex flex-col gap-8 rounded-t-primary bg-black',
    (unlockedAssets > 0) && 'shimmer-slow-ride')}>
    <div>Your vault balance</div>
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-neutral-500 text-sm">
        <Odometer value={parseFloat(formatUnits(shares, decimals))} format="(,ddd).dd" />
        <div>shares of {symbol}</div>
      </div>
      <div className="flex items-center justify-between">
        <div data-zero={unlockedAssets === 0} className="text-5xl data-[zero=true]:text-neutral-500">
          <Odometer value={unlockedAssets} format="(,ddd).dddddd" duration={unlockInterval} />
        </div>
        <Suspense fallback={<Skeleton className="w-28 h-10 rounded-primary" />}>
          <InputLabel />
        </Suspense>
      </div>
      <div className="flex items-center gap-1 text-neutral-500 text-sm">
        <div>$</div>
        <Odometer value={priced(unlockedAssets1e18, decimals, assetPrice)} format="(,ddd).dd" />
      </div>
    </div>
    <div className="flex items-center justify-start">
      <Switch />
    </div>
  </div>
}

function Suspender({ 
  chainId,
  vault,
  className 
}: {
  chainId: number,
  vault: EvmAddress, 
  className?: string
}) {
  const { address: wallet } = useAccount()
  const { setChainId, setWallet, setVault } = useParameters()

  useEffect(() => {
    setChainId(chainId)
    setWallet(wallet)
    setVault(vault)
  }, [chainId, vault, wallet, setChainId, setWallet, setVault])

  return <div className={cn(`flex flex-col gap-0`, className)}>
    <Suspense fallback={<Skeleton className="w-full h-64 rounded-t-primary" />}>
      <VaultBalance />
    </Suspense>
    <div className="flex flex-col gap-8">
      <InputPanel />
      <Action chainId={chainId} />
    </div>
  </div>
}

export default function DepositWithdraw({ 
  chainId,
  vault,
  className
}: { 
  chainId: number,
  vault: EvmAddress,
  className?: string
}) {
  return <Suspense fallback={<Skeleton className="w-full h-96 rounded-primary" />}>
    <Suspender chainId={chainId} vault={vault} className={className} />
  </Suspense>
}
