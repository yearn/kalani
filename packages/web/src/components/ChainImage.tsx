import { cn } from "../lib/shadcn"

export default function ChainImage({ 
  chainId,
  size,
  className
}: { 
  chainId: number,
  size?: number,
  className?: string
}) {
  return <img
    src={`${import.meta.env.VITE_SMOL_ASSETS}/api/chain/${chainId}/logo-128.png`}
    alt={`Chain ${chainId} logo`}
    width={size ?? 32}
    height={size ?? 32}
    className={cn('inline-block ml-1', chainId === 100 ? 'invert' : '', className)} />
}
