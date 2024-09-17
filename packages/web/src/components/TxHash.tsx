import { fHexString } from '../lib/format'
import { HexString } from '@kalani/lib/types'
import Copy from './Copy'
import { cn } from '../lib/shadcn'
import { getChain } from '../lib/chains'
import A from './elements/A'
import { useMemo } from 'react'

export default function TxHash({ chainId, hash, className }: { chainId: number, hash: HexString, className?: string }) { 
  const chain = getChain(chainId)
  const href = useMemo(() => {
    const explorer = chain.blockExplorers.default
    return `${explorer.url}/tx/${hash}`
  }, [chain, hash])

  return <div className={cn('flex items-center gap-3', className)}>
    <A href={href} target="_blank" rel="noreferrer">{fHexString(hash)}</A>
    <Copy text={hash} />
  </div>
}
