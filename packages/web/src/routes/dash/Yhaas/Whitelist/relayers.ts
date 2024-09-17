import { useAccount } from 'wagmi'
import { EvmAddress } from '@kalani/lib/types'

export const RELAYERS: Record<number, EvmAddress> = {
  1: '0x604e586F17cE106B64185A7a0d2c1Da5bAce711E',
  42161: '0xE0D19f6b240659da8E87ABbB73446E7B4346Baee',
  137: '0x3A95F75f0Ea2FD60b31E7c6180C7B5fC9865492F',
  100: '0x46679Ba8ce6473a9E0867c52b5A50ff97579740E',
  8453: '0x46679Ba8ce6473a9E0867c52b5A50ff97579740E',
  10: '0x21BB199ab3be9E65B1E60b51ea9b0FE9a96a480a',
}

export function useRelayer() {
  const { chainId } = useAccount()
  return chainId ? RELAYERS[chainId] : undefined
}
