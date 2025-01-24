import { mainnet, polygon, gnosis, arbitrum, base } from 'viem/chains'
import { defineChain } from 'viem'

export const customChains = {
  mode: /*#__PURE__*/ defineChain({
    id: 34443,
    name: 'Mode Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://mainnet.mode.network'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Mode Explorer',
        url: 'https://explorer.mode.network',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 2465882,
      },
    },
    iconUrl: '/mode.png',
    testnet: false,
  }),

  sonic: /*#__PURE__*/ defineChain({
    id: 146,
    name: 'Sonic',
    nativeCurrency: {
      decimals: 18,
      name: 'Sonic',
      symbol: 'S',
    },
    rpcUrls: {
      default: { http: ['https://rpc.soniclabs.com'] },
    },
    blockExplorers: {
      default: {
        name: 'Sonic Explorer',
        url: 'https://sonicscan.org/',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 60,
      },
    },
    iconUrl: '/s.png',
    testnet: false,
  })
}

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

export const _mode = Object.assign({}, customChains.mode, {
  "id": 34443,
  "rpcUrls": {
    "default": {
      "http": [rpc(34443)]
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

export const _base = Object.assign({}, base, {
  "id": 8453,
  "rpcUrls": {
    "default": {
      "http": [rpc(8453)]
    }
  }
})

export const _sonic = Object.assign({}, customChains.sonic, {
  "id": 146,
  "rpcUrls": {
    "default": {
      "http": [rpc(146)]
    }
  }
})

export const chains = [_mainnet, _gnosis, _polygon, _sonic, _mode, _arbitrum, _base] as const

export function getChain(chainId: number) {
  const result = chains.find(n => n.id === chainId)
  if(!result) throw new Error(`bad chainId, ${chainId}`)
  return result
}
