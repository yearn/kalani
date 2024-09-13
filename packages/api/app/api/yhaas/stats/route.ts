import { NextResponse } from 'next/server'
import Redis from 'ioredis'
import { getAutomationStats } from '../measure/lib'

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

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
