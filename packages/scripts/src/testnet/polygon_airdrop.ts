import { EvmAddress } from '@kalani/lib/types'
import { createTestnetClient } from '@kalani/lib/tenderly'
import { polygon, type Chain } from 'viem/chains'
import { erc20Abi, getContract } from 'viem'

const ALICE: EvmAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const USDC_POLYGON: EvmAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'

async function main() {
  const chain: Chain = {
    ...polygon,
    rpcUrls: { default: { http: [process.env.TESTNET_ADMIN_RPC_137 ?? ''] } }
  } as const

  const client = createTestnetClient(chain)
  await client.setErc20Balance(ALICE, USDC_POLYGON, 1_000_000n * 10n ** 6n)
  const usdc = getContract({ abi: erc20Abi, address: USDC_POLYGON, client })
  console.log('👹', 'balance', await usdc.read.balanceOf([ALICE]))
}

main()
