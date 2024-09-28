import { EvmAddress } from '@kalani/lib/types'
import { cn } from '../lib/shadcn'
import { zeroAddress } from 'viem'
import ImgOrBg from './ImgOrBg'

export default function TokenImg({ 
  chainId,
  address,
  size,
  className
}: { 
  chainId: number,
  address?: EvmAddress,
  size?: number,
  className?: string
}) {
  return <ImgOrBg
    bgClassName="bg-neutral-900 rounded-full"
    src={`${import.meta.env.VITE_SMOL_ASSETS}/api/token/${chainId}/${address ?? zeroAddress}/logo-128.png`}
    alt={`Token ${address} image`}
    width={size ?? 32}
    height={size ?? 32}
    className={cn(chainId === 100 ? 'invert' : '', className)} />
}
