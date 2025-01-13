import { useCallback } from 'react'
import { useSuspendedParameters } from './useParameters'
import { useVaultAsset } from './useVaultAsset'
import { useBalance } from '../../hooks/useBalance'
import { cn } from '../../lib/shadcn'
import { useVaultBalance } from './useVaultBalance'
import { formatUnits } from 'viem'

export default function Max({ className }: { className?: string }) {
  const { mode, chainId, vault, wallet, setAmount } = useSuspendedParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  const { balance, decimals } = useBalance({ chainId, token: asset.address, address: wallet! })
  const { assets } = useVaultBalance({ chainId: chainId!, vault: vault!, wallet: wallet! })

  const onClick = useCallback(() => {
    if (mode === 'deposit') {
      setAmount(formatUnits(balance ?? 0n, decimals ?? 18))
    } else {
      setAmount(formatUnits(assets, decimals ?? 18))
    }
  }, [mode, balance, decimals, assets, setAmount])

  return <button type="button" onClick={onClick} className={cn(`px-3 py-1 
    flex items-center gap-3 
    bg-neutral-900 border-primary border-neutral-900
    hover:text-secondary-50 hover:bg-neutral-900 hover:border-secondary-50
    active:text-secondary-400 active:border-secondary-400 active:bg-black
    rounded-full cursor-pointer pointer-events-auto`, className)}>
    MAX
  </button>
}
