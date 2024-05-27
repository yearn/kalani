import { mainnet, polygon } from '@wagmi/chains'

export function networks(chainId: number) {
  const result = [mainnet, polygon].find(n => n.id === chainId)
  if(!result) throw new Error(`bad chainId, ${chainId}`)
  return result
}
