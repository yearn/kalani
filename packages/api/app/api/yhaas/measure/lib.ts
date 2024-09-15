import z from 'zod'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import Redis from 'ioredis'
import Moralis from 'moralis'
import { AutomationStats, AutomationStatsSchema, YhaasExecutor } from '@kalani/lib/types'

export const REDIS_KEY = 'yhaas:automations'

export const chains = {
  [parseInt(EvmChain.ETHEREUM.hex, 16)]: EvmChain.ETHEREUM,
  [parseInt(EvmChain.POLYGON.hex, 16)]: EvmChain.POLYGON,
  [parseInt(EvmChain.GNOSIS.hex, 16)]: EvmChain.GNOSIS,
  [parseInt(EvmChain.ARBITRUM.hex, 16)]: EvmChain.ARBITRUM,
  [parseInt(EvmChain.BASE.hex, 16)]: EvmChain.BASE
}

export const defaultAutomationStats = AutomationStatsSchema.parse({
  [parseInt(EvmChain.ETHEREUM.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 19483613n,
      automations: 0,
      gas: 0n
    }] },
  [parseInt(EvmChain.POLYGON.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 58788062n,
      automations: 0,
      gas: 0n
    }] },
    [parseInt(EvmChain.GNOSIS.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 35097929n,
      automations: 0,
      gas: 0n
    }] },
    [parseInt(EvmChain.ARBITRUM.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 226203220n,
      automations: 0,
      gas: 0n
    }] },
    [parseInt(EvmChain.BASE.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 19170746n,
      automations: 0,
      gas: 0n
    }] }
})

export async function getAutomationStats(redis: Redis): Promise<AutomationStats> {
  const value = await redis.get(REDIS_KEY)
  if (value) {
    const parsedValue = AutomationStatsSchema.parse(JSON.parse(value))
    const mergedValue: AutomationStats = {}
    for (const key of Object.keys(defaultAutomationStats)) {
      mergedValue[key] = { executors: [] }
      for (const defaultExecutor of defaultAutomationStats[key].executors) {
        const parsedExecutor = parsedValue[key].executors.find(e => e.address === defaultExecutor.address)
        if (parsedExecutor) {
          mergedValue[key].executors.push(parsedExecutor)
        } else {
          mergedValue[key].executors.push(defaultExecutor)
        }
      }
    }
    return mergedValue
  } else {
    return defaultAutomationStats
  }
}

export async function getExecutorAutomations(chain: EvmChain, executor: YhaasExecutor): Promise<YhaasExecutor> {
  console.log('# getExecutorAutomations', chain.name, executor.address, executor.block)

  let cursor: string | undefined = undefined
  let automations = executor.automations
  let gas = executor.gas
  let block = executor.block
  let hasNext = true

  while (hasNext) {
    console.log('💵', 'getWalletHistory, 150 CUs')
    const response = await Moralis.EvmApi.wallets.getWalletHistory({
      chain,
      address: executor.address,
      includeInternalTransactions: false,
      fromBlock: Number(executor.block),
      order: 'ASC',
      cursor
    })

    for (const tx of response.result) {
      if (
        compareEvmAddresses(tx.fromAddress.checksum, executor.address)
        && tx.category === 'contract interaction'
      ) {
        automations++
        gas += BigInt(tx.gasPrice) * BigInt(tx.receiptGasUsed)
      }
    }

    block = response.result[response.result.length - 1].blockNumber.toBigInt()
    cursor = response.pagination.cursor
    hasNext = response.hasNext()
  }

  return {
    ...executor,
    automations,
    gas,
    block
  }
}
