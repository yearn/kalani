import Image from 'next/image'

export function ChainImage({ 
  chainId,
  size
}: { 
  chainId: number,
  size?: number
}) {
  return <Image
    src={`https://assets.smold.app/api/chain/${chainId}/logo-128.png`}
    alt={`Chain ${chainId} logo`}
    width={size ?? 32}
    height={size ?? 32}
    className={`inline-block ml-1 ${chainId === 100 ? 'invert' : ''}`} />
}
