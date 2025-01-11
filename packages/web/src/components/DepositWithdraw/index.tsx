import { EvmAddress } from '@kalani/lib/types'
import { cn } from '../../lib/shadcn'
import Action from './Action'
import { Input } from './Input'
import { useDepositParameters, useSuspendedDepositParameters } from './useDepositParameters'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useVaultAsset } from './useVaultAsset'
import { useBalance } from '../../hooks/useBalance'
import { formatUnits } from 'viem'
import Skeleton from '../Skeleton'
import bmath, { priced } from '@kalani/lib/bmath'
import { usePrice } from '../../hooks/usePrices'
import { isSomething } from '@kalani/lib/strings'
import Odometer from 'react-odometerjs'
import { useAccount } from 'wagmi'
import { useVaultBalance } from './useVaultBalance'
import { fTokens } from '@kalani/lib/format'

function SwitchOption({ selected, onClick, children }: { selected: boolean, onClick: () => void, children: React.ReactNode }) {
  return <div data-selected={selected} onClick={onClick} className={cn(`
    px-6 py-2 bg-transparent
    text-neutral-400 hover:text-neutral-50 active:text-neutral-400 
    data-[selected=true]:bg-secondary-400
    data-[selected=true]:text-neutral-900
    rounded-full cursor-pointer`)}>
    {children}
  </div>
}

function Switch() {
  return <div className="w-min flex items-center gap-2 bg-black rounded-full">
    <SwitchOption selected={true} onClick={() => {}}>Deposit</SwitchOption>
    <SwitchOption selected={false} onClick={() => {}}>Withdraw</SwitchOption>
  </div>
}

function Max({ className }: { className?: string }) {
  const { chainId, vault, wallet, setAmount } = useDepositParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  const { balance, decimals } = useBalance({ chainId, token: asset.address, address: wallet! })

  const onClick = useCallback(() => {
    setAmount(bmath.div(balance ?? 0n, 10n ** BigInt(decimals ?? 18)).toString())
  }, [balance, decimals, setAmount])

  return <button type="button" onClick={onClick} className={cn(`px-3 py-1 
    flex items-center gap-3 
    bg-neutral-900 border-primary border-neutral-900
    hover:text-secondary-50 hover:bg-neutral-900 hover:border-secondary-50
    active:text-secondary-400 active:border-secondary-400 active:bg-black
    rounded-full cursor-pointer pointer-events-auto`, className)}>
    MAX
  </button>
}

function Balance() {
  const { chainId, vault, wallet } = useSuspendedDepositParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  const { balance, decimals } = useBalance({ chainId, token: asset!.address, address: wallet! })
  return <div className="flex items-center gap-2">
    <div>Balance</div>
    <Odometer value={Number(formatUnits(balance ?? 0n, decimals ?? 18))} format="(,ddd).dd" />
  </div>
}

function AmountUSD() {
  const { chainId, vault, amount } = useSuspendedDepositParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  const expanded = useMemo(() => BigInt(isSomething(amount) ? Number(amount) * 10 ** (asset!.decimals) : 0), [amount, asset])
  const price = usePrice(chainId ?? 0, asset!.address)
  const priced = useMemo(() => bmath.priced(expanded, asset?.decimals ?? 18, price ?? 0), [expanded, asset, price])
  return <div className="flex items-center gap-1">
    <div>$</div>
    <Odometer value={priced} format="(,ddd).dd" />
  </div>
}

function InputLabel() {
  const { chainId, vault } = useSuspendedDepositParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  return <div className="text-neutral-500 text-5xl">{asset?.symbol}</div>
}

function Deposit() {
  const { isConnected } = useAccount()

  return <div className={`relative p-6
    flex flex-col gap-3
    border-primary border-neutral-900 bg-secondary-2000
    hover:text-secondary-50 hover:border-secondary-50
    focus-within:!text-secondary-400 focus-within:!border-secondary-400 focus-within:!bg-black
    active:!text-secondary-400 active:!border-secondary-400 active:!bg-black
    rounded-b-primary hover:rounded-primary focus-within:rounded-primary saber-glow`}>

    <div className="flex items-center justify-between">
      <Input mode="in" className="text-5xl" />
      <div className="hidden">
        <Suspense fallback={<Skeleton className="w-28 h-10 rounded-primary" />}>
          <InputLabel />
        </Suspense>
      </div>
    </div>

    <div className="flex items-center justify-between text-neutral-500 text-sm">
      <Suspense fallback={<Skeleton className="w-24 h-8 rounded-primary" />}>
        {isConnected && <AmountUSD />}
        {!isConnected && <>$ 0.00</>}
      </Suspense>
      <div className="flex items-center gap-4">
        <Suspense fallback={<Skeleton className="w-24 h-8 rounded-primary" />}>
          {isConnected && <Balance />}
          {!isConnected && <div>Balance 0</div>}
        </Suspense>
        <Suspense fallback={<Skeleton className="w-16 h-8 rounded-primary" />}>
          <Max className="px-6" />
        </Suspense>
      </div>
    </div>
  </div>
}

function useAssetUnlocker({ chainId, vault, wallet }: { chainId: number, vault: EvmAddress, wallet: EvmAddress }) {
  const { assets, apr } = useVaultBalance({ chainId, vault, wallet })
  const [unlocked, setUnlocked] = useState(assets)

  useEffect(() => {
    const interval = 10_000
    let tick = 0
    const handle = setInterval(() => {
      setUnlocked(assets + bmath.mulb(assets, apr * (interval * tick) / (365 * 24 * 60 * 60 * 1000)))
      tick += 1
    }, interval)
    return () => clearInterval(handle)
  }, [assets, apr, setUnlocked])

  return useMemo(() => unlocked > assets ? unlocked : assets, [unlocked, assets])
}

function VaultBalance() {
  const { chainId, vault, wallet } = useSuspendedDepositParameters()
  const { shares, decimals, assetPrice } = useVaultBalance({ chainId: chainId!, vault: vault!, wallet: wallet! })
  const unlockedAssets1e18 = useAssetUnlocker({ chainId: chainId!, vault: vault!, wallet: wallet! })
  const unlockedAssets = useMemo(() => bmath.div(unlockedAssets1e18, 10n ** BigInt(decimals)), [unlockedAssets1e18, decimals])

  return <div className={cn(
    'p-6 flex flex-col gap-8 border-primary border-b-0 border-neutral-900 rounded-t-primary bg-black',
    (unlockedAssets > 0) && 'shimmer-slow-ride')}>
    <div>Your vault balance</div>
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <div data-zero={unlockedAssets === 0} className="text-5xl data-[zero=true]:text-neutral-500">
          <Odometer value={unlockedAssets} format="(,ddd).dd" />
        </div>
        <div className="text-neutral-500 text-sm">
          $&nbsp;<Odometer value={priced(unlockedAssets1e18, decimals, assetPrice)} format="(,ddd).dd" />
        </div>
      </div>
      <Suspense fallback={<Skeleton className="w-28 h-10 rounded-primary" />}>
        <InputLabel />
      </Suspense>
    </div>
    <div className="flex items-center justify-between">
      <Switch />
      <div className="flex items-center gap-2 text-neutral-500 text-sm">
        <Odometer value={parseFloat(fTokens(shares, decimals))} format="(,ddd).dd" />
        <div>shares of yUSDC</div>
      </div>
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
  const { setChainId, setWallet, setVault } = useDepositParameters()

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
      <Deposit />
      <Action />
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