import { Chain } from 'viem'
import { mainnet, polygon, gnosis, arbitrum } from 'viem/chains'

const testnet = Boolean(process.env.TESTNET ?? false)

export function getRpc(chainId: number) {
  const rpcEnvar = `RPC_${chainId}`
  const testnetEnvar = `TESTNET_RPC_${chainId}`
  return testnet ? process.env[testnetEnvar] ?? process.env[rpcEnvar] : process.env[rpcEnvar]
}

export const chains: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [polygon.id]: polygon,
  [gnosis.id]: gnosis,
  [arbitrum.id]: arbitrum
}
