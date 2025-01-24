import { Chain } from 'viem'
import { mainnet, polygon, sonic, gnosis, mode, arbitrum, base } from 'viem/chains'

const testnet = Boolean(process.env.TESTNET ?? false)

export function getRpc(chainId: number) {
  const rpcEnvar = `RPC_${chainId}`
  const testnetEnvar = `TESTNET_RPC_${chainId}`
  return testnet ? process.env[testnetEnvar] ?? process.env[rpcEnvar] : process.env[rpcEnvar]
}

export const chains: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [gnosis.id]: gnosis,
  [polygon.id]: polygon,
  [sonic.id]: sonic,
  [mode.id]: mode,
  [arbitrum.id]: arbitrum,
  [base.id]: base,
}
