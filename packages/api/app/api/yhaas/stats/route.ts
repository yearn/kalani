import '@/lib/global'
import { NextResponse } from 'next/server'
import Redis from 'ioredis'
import { getAutomationStats } from '../measure/lib'
import { CORS_HEADERS } from '../../headers'

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')

const headers = { ...CORS_HEADERS }

export async function OPTIONS() {
  const response = new Response('', { headers })
  return response
}

export async function GET(request: Request) {
  try {
    const stats = await getAutomationStats(redis)
    return NextResponse.json(stats, { headers })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { headers, status: 500 })
  }
}
