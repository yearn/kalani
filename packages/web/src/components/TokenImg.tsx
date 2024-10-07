import { EvmAddress } from '@kalani/lib/types'
import { cn } from '../lib/shadcn'
import { zeroAddress } from 'viem'
import ImgOrBg from './ImgOrBg'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'

export default function TokenImg(options: {
  chainId?: number,
  address?: EvmAddress,
  size?: number,
  className?: string,
  bgClassName?: string
}) {
  const { chainId: optionalChainId, address, size, className, bgClassName } = options
  const { chainId: defaultChainId } = useAccount()
  const chainId = useMemo(() => optionalChainId ?? defaultChainId ?? 1, [optionalChainId, defaultChainId])

  return <ImgOrBg
    bgClassName={cn('bg-neutral-900 rounded-full', bgClassName)}
    src={`${import.meta.env.VITE_SMOL_ASSETS}/api/token/${chainId}/${address ?? zeroAddress}/logo-128.png`}
    alt={`Token ${address} image`}
    width={size ?? 32}
    height={size ?? 32}
    className={cn(chainId === 100 ? 'invert' : '', className)} />
}
