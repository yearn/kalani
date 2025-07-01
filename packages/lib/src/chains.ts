import { Chain, defineChain } from 'viem'
import { mainnet, polygon, sonic, gnosis, mode, arbitrum, base, berachain } from 'viem/chains'

const testnet = Boolean(process.env.TESTNET ?? false)

export function getRpc(chainId: number) {
  const rpcEnvar = `RPC_${chainId}`
  const testnetEnvar = `TESTNET_RPC_${chainId}`
  return testnet ? process.env[testnetEnvar] ?? process.env[rpcEnvar] : process.env[rpcEnvar]
}

export const customChains = {
  katana: /*#__PURE__*/ defineChain({
    id: 747474,
    name: 'Katana',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: { http: ['https://rpc.katanarpc.com'] },
    },
    blockExplorers: {
      default: {
        name: 'Katana Explorer',
        url: 'https://explorer.katanarpc.com',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 1898013,
      },
    },
    testnet: false,
  })
}

export const chains: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [gnosis.id]: gnosis,
  [polygon.id]: polygon,
  [sonic.id]: sonic,
  [base.id]: base,
  [mode.id]: mode,
  [arbitrum.id]: arbitrum,
  [berachain.id]: berachain,
  [customChains.katana.id]: customChains.katana,
}
