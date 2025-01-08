import { EvmAddress } from '@kalani/lib/types'
import { cn } from '../../lib/shadcn'
import Action from './Action'
import { Input } from './InputPanel/Input'
import { useDepositParameters, useSuspendedDepositParameters } from './useDepositParameters'
import { Suspense, useCallback, useEffect, useMemo } from 'react'
import { useVaultAsset } from './useVaultAsset'
import { useBalance } from '../../hooks/useBalance'
import { formatUnits, zeroAddress } from 'viem'
import Skeleton from '../Skeleton'
import bmath from '@kalani/lib/bmath'
import usePrices from '../../hooks/usePrices'
import { isSomething } from '@kalani/lib/strings'
import { PiGear } from 'react-icons/pi'
import Odometer from 'react-odometerjs'
import { useAccount } from 'wagmi'

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
  const { balance, decimals } = useBalance({ chainId, token: asset?.address ?? zeroAddress, address: wallet ?? zeroAddress })

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
  const prices = usePrices(chainId ?? 0, [asset!.address])
  const price = prices.data[asset!.address]
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
    border-primary border-transparent bg-secondary-2000
    hover:text-secondary-50 hover:border-secondary-50
    focus-within:!text-secondary-400 focus-within:!border-secondary-400 focus-within:!bg-black
    active:!text-secondary-400 active:!border-secondary-400 active:!bg-black
    rounded-primary saber-glow`}>

    <div className="flex items-center justify-between">
      <Input mode="in" className="text-5xl" />
      <Suspense fallback={<Skeleton className="w-28 h-12 rounded-primary" />}>
        <InputLabel />
      </Suspense>
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

  return <div className={cn(`p-8 flex flex-col gap-8
    border-primary border-neutral-900 rounded-primary`, className)}>
    <div className="flex items-center justify-between">
      <Switch />
      <div className="hidden text-neutral-500 text-sm">
        <PiGear size={32} />
      </div>
    </div>
    <Deposit />
    <Action />
  </div>
}

export default function VaultPosition({ 
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