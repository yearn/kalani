import { useAccount } from 'wagmi'
import { EvmAddress } from '@kalani/lib/types'
import { zeroAddress } from 'viem'

export const RELAYERS: Record<number, EvmAddress[]> = {
  1: ['0x604e586F17cE106B64185A7a0d2c1Da5bAce711E', '0xc2d26d13582324f10c7c3753B8F5Fc71011EcF57'],
  10: ['0x21BB199ab3be9E65B1E60b51ea9b0FE9a96a480a'],
  100: ['0x46679Ba8ce6473a9E0867c52b5A50ff97579740E'],
  137: ['0x3A95F75f0Ea2FD60b31E7c6180C7B5fC9865492F'],
  146: [zeroAddress],
  8453: ['0x46679Ba8ce6473a9E0867c52b5A50ff97579740E'],
  34443: [zeroAddress],
  42161: ['0xE0D19f6b240659da8E87ABbB73446E7B4346Baee'],
}

export function useRelayers(chainId?: number) {
  const { chainId: accountChainId } = useAccount()
  const chainIdToUse = chainId ?? accountChainId
  return chainIdToUse ? RELAYERS[chainIdToUse] : []
}
