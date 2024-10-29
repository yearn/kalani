import { NextResponse } from 'next/server'
import { fetchAllOpenIssues } from '@/lib/gh'
import { CORS_HEADERS } from '../../headers'

const headers = { ...CORS_HEADERS }

export async function OPTIONS() {
  const response = new Response('', { headers })
  return response
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 1000
    const issues = await fetchAllOpenIssues(limit)
    return NextResponse.json(issues, { headers })
  } catch (error) {
    console.error('Error fetching open issues:', error)
    return NextResponse.json({ error: 'Failed to fetch open issues' }, { headers, status: 500 })
  }
}
