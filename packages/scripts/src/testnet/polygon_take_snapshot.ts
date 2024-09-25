import { createTestnetClient } from '@kalani/lib/tenderly'
import { polygon, type Chain } from 'viem/chains'

async function main() {
  const chain: Chain = {
    ...polygon,
    rpcUrls: { default: { http: [process.env.TESTNET_ADMIN_RPC_137 ?? ''] } }
  } as const

  const client = createTestnetClient(chain)
  const snapshot = await client.snapshot()
  console.log('👹', 'snapshot', snapshot)
}

main()
