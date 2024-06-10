import { mainnet, polygon, gnosis, arbitrum } from '@wagmi/chains'

const TESTNET = process.env.NEXT_PUBLIC_TESTNET === 'true'

export const testnet = Object.assign({}, polygon, {
  "id": 137,
  "rpcUrls": {
    "default": {
      "http": [process.env.NEXT_PUBLIC_TESTNET_RPC_137]
    }
  }
})

export const chains = [
  ...(TESTNET ? [testnet] : []), 
  mainnet, gnosis, polygon, arbitrum
] as const

export function getChain(chainId: number) {
  const result = chains.find(n => n.id === chainId)
  if(!result) throw new Error(`bad chainId, ${chainId}`)
  return result
}
