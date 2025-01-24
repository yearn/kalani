import { useMemo } from 'react'
import { cn } from '../lib/shadcn'

const customs: Record<number, string> = {
  146: 's.png',
  34443: 'mode.png'
} as const

export default function ChainImg({ 
  chainId,
  size,
  className
}: { 
  chainId: number,
  size?: number,
  className?: string
}) {
  const src = useMemo(() => {
    if(customs[chainId]) return `/${customs[chainId]}`
    return `${import.meta.env.VITE_SMOL_ASSETS}/api/chain/${chainId}/logo-128.png`
  }, [chainId])

  return <img
    src={src}
    alt={`Chain ${chainId} image`}
    width={size ?? 32}
    height={size ?? 32}
    className={cn('inline-block ml-1', chainId === 100 ? 'invert' : '', className)} />
}
