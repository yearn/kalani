import { mainnet, polygon, gnosis } from '@wagmi/chains'

const DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

export const testnet = Object.assign({}, polygon, {
  "id": 137,
  "rpcUrls": {
    "default": {
      "http": [process.env.NEXT_PUBLIC_TESTNET_RPC]
    }
  }
})

export const chains = [
  ...(DEV ? [testnet] : []), 
  mainnet, gnosis, polygon
] as const

export function getChain(chainId: number) {
  const result = chains.find(n => n.id === chainId)
  if(!result) throw new Error(`bad chainId, ${chainId}`)
  return result
}
