import { mainnet, polygon, gnosis, arbitrum } from '@wagmi/chains'

function rpc(chainId: number) {
  if(import.meta.env.VITE_TESTNET === 'true') {
    const testnet = import.meta.env[`VITE_TESTNET_RPC_${chainId}`]
    if(testnet) return testnet
  }
  return import.meta.env[`VITE_RPC_${chainId}`]
}

export const _mainnet = Object.assign({}, mainnet, {
  "id": 1,
  "rpcUrls": {
    "default": {
      "http": [rpc(1)]
    }
  }
})

export const _gnosis = Object.assign({}, gnosis, {
  "id": 100,
  "rpcUrls": {
    "default": {
      "http": [rpc(100)]
    }
  }
})

export const _polygon = Object.assign({}, polygon, {
  "id": 137,
  "rpcUrls": {
    "default": {
      "http": [rpc(137)]
    }
  }
})

export const _arbitrum = Object.assign({}, arbitrum, {
  "id": 42161,
  "rpcUrls": {
    "default": {
      "http": [rpc(42161)]
    }
  }
})

export const chains = [_mainnet, _gnosis, _polygon, _arbitrum] as const

export function getChain(chainId: number) {
  const result = chains.find(n => n.id === chainId)
  if(!result) throw new Error(`bad chainId, ${chainId}`)
  return result
}
