import { fEvmAddress } from '@kalani/lib/format'
import { EvmAddress } from '@kalani/lib/types'
import Copy from './Copy'
import { cn } from '../lib/shadcn'
import { getChain } from '../lib/chains'
import A from './elements/A'
import { useMemo } from 'react'
import { PiArrowSquareOutBold } from 'react-icons/pi'

export default function EvmAddressChip({
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

  return <div className={cn('group px-3 py-1 rounded-full flex items-center overflow-hidden transition-all duration-150', className)}>
    <div className="cursor-default">{fEvmAddress(address)}</div>
    <div className="flex items-center gap-3 transition-all duration-100 max-w-0 group-hover:max-w-full">
      <div className="transform -translate-x-4 opacity-0 transition-all duration-150 pl-3 group-hover:translate-x-0 group-hover:opacity-100 flex items-center gap-3">
        <Copy text={address} />
        <A href={href} target="_blank" rel="noreferrer"><PiArrowSquareOutBold /></A>
      </div>
    </div>
  </div>
}
