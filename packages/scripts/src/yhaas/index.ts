import z from 'zod'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import bmath from '@kalani/lib/bmath'
import Redis from 'ioredis'
import Moralis from 'moralis'
import { formatEther } from 'viem'

// 150 CU usage
// https://docs.moralis.io/web3-data-api/evm/reference/wallet-api/get-wallet-history?address=0xcB1C1FdE09f811B294172696404e88E658659905&chain=eth&order=DESC
// https://docs.moralis.io/web3-data-api/evm/reference/pagination

Object.defineProperty(BigInt.prototype, 'toJSON', {
  get() {
    'use strict'
    return () => String(this)
  }
})

const REDIS_KEY = 'yhaas:automations'
const MORALIS_API_KEY = process.env.MORALIS_API_KEY

async function getRedisMemoryMB(redis: Redis): Promise<number> {
  const memoryInfo = await redis.info('memory')
  const usedMemory = parseInt(memoryInfo.match(/used_memory:(\d+)/)?.[1] ?? '0')
  const maxMemory = parseInt(memoryInfo.match(/maxmemory:(\d+)/)?.[1] ?? '0')
  if (maxMemory > 0) {
    return Number(((maxMemory - usedMemory) / 1024 / 1024).toFixed(2))
  } else {
    return Infinity // Indicates unlimited memory
  }
}

const ExecutorSchema = z.object({
  address: z.string(),
  block: z.bigint({ coerce: true }),
  automations: z.number({ coerce: true }),
  gas: z.bigint({ coerce: true })
})

type Executor = z.infer<typeof ExecutorSchema>

const AutomationStatsSchema = z.record(
  z.string(), z.object({ executors: ExecutorSchema.array() })
)

type AutomationStats = z.infer<typeof AutomationStatsSchema>

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

async function getAutomationStats(redis: Redis): Promise<AutomationStats> {
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

async function getExecutorAutomations(chain: EvmChain, executor: Executor): Promise<Executor> {
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

async function REFRESH(redis: Redis) {
  const stats = await getAutomationStats(redis)

  for (const [chainIdStr, chain] of Object.entries(chains)) {
    const chainId = parseInt(chainIdStr)
    for (let i = 0; i < stats[chainId].executors.length; i++) {
      stats[chainId].executors[i] = await getExecutorAutomations(chain, stats[chainId].executors[i])
    }
  }

  await redis.set(REDIS_KEY, JSON.stringify(stats))
  console.log('💾', 'set stats')
}

async function RESET(redis: Redis) {
  await redis.del(REDIS_KEY)
}

async function REPORT(redis: Redis) {
  const c = 1.715
  const stats = await getAutomationStats(redis)
  const totalAutomations = Object.values(stats).reduce((acc, chain) => acc + chain.executors.reduce((acc, executor) => acc + executor.automations, 0), 0)
  const totalGas = Object.values(stats).reduce((acc, chain) => acc + chain.executors.reduce((acc, executor) => acc + executor.gas, 0n), 0n)

  const gasSpent = stats[1].executors.reduce((acc, executor) => acc + executor.gas, 0n)
  const gasThatWouldHaveBeenSpent = bmath.mulb(gasSpent, c)
  const gasSaved = gasThatWouldHaveBeenSpent - gasSpent

  console.log('📊', stats)
  console.log('🤖', 'total automations', totalAutomations)
  console.log('⛽️', 'total gas', formatEther(totalGas))
  console.log('💸', 'gas saved', formatEther(gasSaved))
}

async function main() {
  await Moralis.start({ apiKey: MORALIS_API_KEY })
  const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')

  try {
    const memory = await getRedisMemoryMB(redis)
    console.log('📀', 'redis memory', memory)
    // await RESET(redis)
    // await REFRESH(redis)
    await REPORT(redis)
  } finally {
    await redis.quit()
  }
}

main()
