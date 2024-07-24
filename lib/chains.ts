import { mainnet, polygon, gnosis, arbitrum } from '@wagmi/chains'

export const _mainnet = Object.assign({}, mainnet, {
  "id": 1,
  "rpcUrls": {
    "default": {
      "http": [process.env.NEXT_PUBLIC_RPC_1]
    }
  }
})

export const _gnosis = Object.assign({}, gnosis, {
  "id": 100,
  "rpcUrls": {
    "default": {
      "http": [process.env.NEXT_PUBLIC_RPC_100]
    }
  }
})

export const _polygon = Object.assign({}, polygon, {
  "id": 137,
  "rpcUrls": {
    "default": {
      "http": [process.env.NEXT_PUBLIC_RPC_137]
    }
  }
})

export const _arbitrum = Object.assign({}, arbitrum, {
  "id": 42161,
  "rpcUrls": {
    "default": {
      "http": [process.env.NEXT_PUBLIC_TESTNET_RPC_42161]
    }
  }
})

export const chains = [_mainnet, _gnosis, _polygon, _arbitrum] as const

export function getChain(chainId: number) {
  const result = chains.find(n => n.id === chainId)
  if(!result) throw new Error(`bad chainId, ${chainId}`)
  return result
}
