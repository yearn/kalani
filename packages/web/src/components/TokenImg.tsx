import { EvmAddress } from '@kalani/lib/types'
import { cn } from '../lib/shadcn'
import { zeroAddress } from 'viem'
import ImgOrBg from './ImgOrBg'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import ChainImg from './ChainImg'

export default function TokenImg(options: {
  chainId?: number,
  address?: EvmAddress,
  size?: number,
  showChain?: boolean,
  className?: string,
  bgClassName?: string
}) {
  const { chainId: optionalChainId, address, size, showChain, className, bgClassName } = options
  const { chainId: defaultChainId } = useAccount()
  const chainId = useMemo(() => optionalChainId ?? defaultChainId ?? 1, [optionalChainId, defaultChainId])
  const src = useMemo(() => 
    `${import.meta.env.VITE_ASSETS_CDN}/tokens/${chainId}/${(address ?? zeroAddress).toLowerCase()}/logo.svg`, 
    [chainId, address]
  )

  return <div className="relative isolate">
    <ImgOrBg
      bgClassName={cn('z-0 bg-neutral-900 rounded-full', bgClassName)}
      src={src}
      alt={`Token ${address} image`}
      width={size ?? 32}
      height={size ?? 32}
      className={cn(chainId === 100 ? 'z-1 invert' : 'z-1', className)} />
    {showChain && <ChainImg 
      chainId={chainId} 
      size={Math.floor((size ?? 16) / 2)} 
      className={cn('border-3 rounded-full absolute z-[5] -bottom-1 -right-1', bgClassName)} />}
  </div>
}
