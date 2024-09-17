import { createTestnetClient } from '@kalani/lib/tenderly'
import { polygon, type Chain } from 'viem/chains'

async function main() {
  const chain: Chain = {
    ...polygon,
    rpcUrls: { default: { http: [process.env.TESTNET_ADMIN_RPC_137 ?? ''] } }
  } as const
  const client = createTestnetClient(chain)

  const snapshot = process.env.TESTNET_SNAPSHOT_137
  if (!snapshot) throw new Error('TESTNET_SNAPSHOT_137 not set')
  console.log('👹', 'revert snapshot', snapshot)

  try {
    await client.revert(snapshot)
    console.log('👹', 'great success')
  } catch (e) {
    console.error(e)
    console.error('👹', 'curses!')
  }
}

main()
