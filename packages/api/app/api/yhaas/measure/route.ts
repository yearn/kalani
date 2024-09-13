import { NextResponse } from 'next/server'
import Redis from 'ioredis'
import Moralis from 'moralis'
import { chains, getAutomationStats, getExecutorAutomations, REDIS_KEY } from './lib'

Object.defineProperty(BigInt.prototype, 'toJSON', {
  get() {
    'use strict'
    return () => String(this)
  }
})

await Moralis.start({ apiKey: process.env.MORALIS_API_KEY })
const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
    const totalAutomations = Object.values(stats).reduce((acc, chain) => acc + chain.executors.reduce((acc, executor) => acc + executor.automations, 0), 0)
    const totalGas = Object.values(stats).reduce((acc, chain) => acc + chain.executors.reduce((acc, executor) => acc + executor.gas, 0n), 0n)
    console.log('🤖', 'total automations', totalAutomations)
    console.log('⛽️', 'total gas', totalGas)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch open issues' }, { status: 500 })
  }
}
