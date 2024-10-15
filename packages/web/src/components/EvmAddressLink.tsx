import { fEvmAddress } from '@kalani/lib/format'
import { EvmAddress } from '@kalani/lib/types'
import { getChain } from '../lib/chains'
import A from './elements/A'
import { useMemo } from 'react'

export default function EvmAddressLink({
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

  return <A href={href} target="_blank" rel="noreferrer" className={className}>{fEvmAddress(address)}</A>
}
