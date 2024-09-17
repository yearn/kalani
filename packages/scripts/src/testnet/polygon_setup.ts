import { EvmAddress } from '@kalani/lib/types'
import { createTestnetClient } from '@kalani/lib/tenderly'
import { polygon, type Chain } from 'viem/chains'
import { getContract, parseEther } from 'viem'
import abis from '@kalani/lib/abis'

const ALICE: EvmAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const yWMATIC: EvmAddress = '0x28F53bA70E5c8ce8D03b1FaD41E9dF11Bb646c36'
const yWMATIC_ROLE_MANAGER: EvmAddress = '0xC4ad0000E223E398DC329235e6C497Db5470B626'
const AAVE_LENDER: EvmAddress = '0x12c3Ad898e8eB1C0ec0Bb74f9748F36C46593F68'
const AAVE_LENDER_MANAGEMENT: EvmAddress = '0x2D57bB1Ad5EaB2caacb50e8527eb0eE504f49e48'
const STMATIC_ACCUMULATOR: EvmAddress = '0xf7464410C1ccF86b19711c9B6599336b00641c8f'
const STMATIC_ACCUMULATOR_MANAGEMENT: EvmAddress = '0x6Ba1734209a53a6E63C39D4e36612cc856A34D56'
const ALLOCATOR: EvmAddress = '0xe1C4843fc70623499b3d960C8EAb3Afefa521c9f'

async function main() {
  const chain: Chain = {
    ...polygon,
    rpcUrls: { default: { http: [process.env.TESTNET_ADMIN_RPC_137 ?? ''] } }
  } as const

  const client = createTestnetClient(chain)
  const snapshot = await client.snapshot()

  try {
    await client.setBalance(ALICE, parseEther('1000'))
    await client.setBalance(yWMATIC_ROLE_MANAGER, parseEther('1000'))
    console.log('👹', 'balances set')

    const dai1 = getContract({ abi: abis.vault, address: yWMATIC, client })
    console.log('👹', 'yvault role manager', await dai1.read.role_manager())
    await dai1.write.transfer_role_manager([ALICE], { account: yWMATIC_ROLE_MANAGER })
    await dai1.write.accept_role_manager({ account: ALICE })
    console.log('👹', 'yvault role manager', await dai1.read.role_manager())

    const spark = getContract({ abi: abis.strategy, address: AAVE_LENDER, client })
    console.log('👹', 'spark management', await spark.read.management())
    await spark.write.setPendingManagement([ALICE], { account: AAVE_LENDER_MANAGEMENT })
    await spark.write.acceptManagement({ account: ALICE })
    console.log('👹', 'spark management', await spark.read.management())

    const stmatic = getContract({ abi: abis.strategy, address: STMATIC_ACCUMULATOR, client })
    console.log('👹', 'stmatic management', await stmatic.read.management())
    await stmatic.write.setPendingManagement([ALICE], { account: STMATIC_ACCUMULATOR_MANAGEMENT })
    await stmatic.write.acceptManagement({ account: ALICE })
    console.log('👹', 'stmatic management', await stmatic.read.management())

  } catch (e) {
    await client.revert(snapshot)
    console.log('👹', 'balance set error', e)
    console.log('👹', 'reverted to snapshot', snapshot)

  }
}

main()
