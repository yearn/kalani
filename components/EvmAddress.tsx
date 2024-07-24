import { fEvmAddress } from '@/lib/format'
import { EvmAddress } from '@/lib/types'
import Copy from './Copy'
import { cn } from '@/lib/shadcn'
import { getChain } from '@/lib/chains'
import A from './elements/A'
import { useMemo } from 'react'

export default function EvmAddressLayout({
  chainId,
  address,
  className
}: {
  chainId: number
  address: EvmAddress
  className?: string
}) {
  const chain = getChain(chainId)
  const href = useMemo(() => {
    const explorer = chain.blockExplorers.default
    return `${explorer.url}/address/${address}`
  }, [chain, address])

  return <div className={cn('flex items-center gap-3', className)}>
    <A href={href} target="_blank" rel="noreferrer">{fEvmAddress(address)}</A>
    <Copy text={address} />
  </div>
}
