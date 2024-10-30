import { createPublicClient, http, CustomTransport } from 'viem'
import { EvmAddress } from './types'
import { PublicClient, Chain } from 'viem'

export type TestnetClient = PublicClient<CustomTransport, Chain> & {
  request: (args: { 
    method: 'tenderly_setBalance' | 'evm_snapshot' | 'evm_revert'
    params: string[] 
  }) => Promise<void | string | boolean>
  setBalance: (address: EvmAddress, amount: bigint) => Promise<void>
  snapshot: () => Promise<string>
  revert: (snapshotId: string) => Promise<boolean>
}

export function createTestnetClient(chain: Chain): TestnetClient {
  const client = createPublicClient({
    chain, transport: http(chain.rpcUrls.default.http[0])
  }) as unknown as TestnetClient

  return {
    ...client,
    setBalance: async (address: EvmAddress, amount: bigint) => {
      return client.request({
        method: 'tenderly_setBalance',
        params: [address, `0x${amount.toString(16)}`],
      }) as Promise<void>
    },
    snapshot: async () => {
      return client.request({
        method: 'evm_snapshot',
        params: [],
      }) as Promise<string>
    },
    revert: async (snapshotId: string) => {
      return client.request({
        method: 'evm_revert',
        params: [snapshotId],
      }) as Promise<boolean>
    },
  }
}
