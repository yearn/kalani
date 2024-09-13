import { NextResponse } from 'next/server'
import z from 'zod'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import Redis from 'ioredis'
import Moralis from 'moralis'

const REDIS_KEY = 'yhaas:automations'
const MORALIS_API_KEY = process.env.MORALIS_API_KEY

const ExecutorSchema = z.object({
  address: z.string(),
  block: z.number(),
  automations: z.number()
})

type Executor = z.infer<typeof ExecutorSchema>

const AutomationStatsSchema = z.record(
  z.string(), z.object({ executors: ExecutorSchema.array() })
)

type AutomationStats = z.infer<typeof AutomationStatsSchema>

const chains = {
  [parseInt(EvmChain.ETHEREUM.hex, 16)]: EvmChain.ETHEREUM,
  [parseInt(EvmChain.POLYGON.hex, 16)]: EvmChain.POLYGON,
  [parseInt(EvmChain.GNOSIS.hex, 16)]: EvmChain.GNOSIS,
  [parseInt(EvmChain.ARBITRUM.hex, 16)]: EvmChain.ARBITRUM,
  [parseInt(EvmChain.BASE.hex, 16)]: EvmChain.BASE
}

const defaultAutomationStats = AutomationStatsSchema.parse({
  [parseInt(EvmChain.ETHEREUM.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 19483613,
      automations: 0
    }] },
  [parseInt(EvmChain.POLYGON.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 58788062,
      automations: 0
    }] },
    [parseInt(EvmChain.GNOSIS.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 35097929,
      automations: 0
    }] },
    [parseInt(EvmChain.ARBITRUM.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 226203220,
      automations: 0
    }] },
    [parseInt(EvmChain.BASE.hex, 16)]: { executors: [{
      address: '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B',
      block: 19170746,
      automations: 0
    }] }
})

async function getAutomationStats(redis: Redis): Promise<AutomationStats> {
  const value = await redis.get(REDIS_KEY)
  if (value) {
    const parsedValue = AutomationStatsSchema.parse(JSON.parse(value))
    const mergedValue: AutomationStats = {}
    for (const key of Object.keys(defaultAutomationStats)) {
      mergedValue[key] = key in parsedValue ? parsedValue[key] : defaultAutomationStats[key]
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
  let block = executor.block
  let hasNext = true

  while (hasNext) {
    console.log('💵', 'getWalletHistory, 150 CUs')
    const response = await Moralis.EvmApi.wallets.getWalletHistory({
      chain,
      address: executor.address,
      includeInternalTransactions: false,
      fromBlock: executor.block,
      order: 'ASC',
      cursor
    })

    for (const tx of response.result) {
      if (
        compareEvmAddresses(tx.fromAddress.checksum, executor.address)
        && tx.category === 'contract interaction'
      ) {
        automations++
      }
    }

    block = Number(response.result[response.result.length - 1].blockNumber)
    cursor = response.pagination.cursor
    hasNext = response.hasNext()
  }

  return {
    ...executor,
    automations,
    block
  }
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await Moralis.start({ apiKey: MORALIS_API_KEY })
  const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')

  try {
    const stats = await getAutomationStats(redis)

    for (const chain of Object.values(chains)) {
      const chainId = parseInt(chain.hex, 16)
      const updatedExecutors = []
      for (const executor of stats[chainId].executors) {
        const update = await getExecutorAutomations(chain, executor)
        updatedExecutors.push(update)
      }
      stats[chainId].executors = updatedExecutors
    }

    await redis.set(REDIS_KEY, JSON.stringify(stats))
    const total = Object.values(stats).reduce((acc, chain) => acc + chain.executors.reduce((acc, executor) => acc + executor.automations, 0), 0)
    console.log('🤖', 'total automations', total)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch open issues' }, { status: 500 })
  } finally {
    await redis.quit()
  }
}
