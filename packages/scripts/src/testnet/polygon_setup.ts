import { EvmAddress, ROLES } from '@kalani/lib/types'
import { createTestnetClient } from '@kalani/lib/tenderly'
import { polygon, type Chain } from 'viem/chains'
import { getContract, parseEther } from 'viem'
import abis from '@kalani/lib/abis'

const ALICE: EvmAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const yWMATIC: EvmAddress = '0x28F53bA70E5c8ce8D03b1FaD41E9dF11Bb646c36'
const USDC_POLYGON: EvmAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
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
    await client.setErc20Balance(ALICE, USDC_POLYGON, parseEther('100000'))
    console.log('👹', 'balances set')

    const vault = getContract({ abi: abis.vault, address: yWMATIC, client })
    console.log('👹', 'yvault role manager', await vault.read.role_manager())
    await vault.write.transfer_role_manager([ALICE], { account: yWMATIC_ROLE_MANAGER })
    await vault.write.accept_role_manager({ account: ALICE })
    console.log('👹', 'yvault role manager', await vault.read.role_manager())

    await vault.write.set_role([ALICE, ROLES.PROFIT_UNLOCK_MANAGER], { account: ALICE })
    console.log('👹', 'alice roles in yvault', await vault.read.roles([ALICE]))

    const strategy_a = getContract({ abi: abis.strategy, address: AAVE_LENDER, client })
    console.log('👹', 'spark management', await strategy_a.read.management())
    await strategy_a.write.setPendingManagement([ALICE], { account: AAVE_LENDER_MANAGEMENT })
    await strategy_a.write.acceptManagement({ account: ALICE })
    console.log('👹', 'spark management', await strategy_a.read.management())

    const strategy_b = getContract({ abi: abis.strategy, address: STMATIC_ACCUMULATOR, client })
    console.log('👹', 'stmatic management', await strategy_b.read.management())
    await strategy_b.write.setPendingManagement([ALICE], { account: STMATIC_ACCUMULATOR_MANAGEMENT })
    await strategy_b.write.acceptManagement({ account: ALICE })
    console.log('👹', 'stmatic management', await strategy_b.read.management())

  } catch (e) {
    await client.revert(snapshot)
    console.log('👹', 'balance set error', e)
    console.log('👹', 'reverted to snapshot', snapshot)

  }
}

main()
