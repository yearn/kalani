import { NextResponse } from 'next/server'
import { CORS_HEADERS, KONG_API_HEADERS } from '../../../headers'

const headers = { ...CORS_HEADERS }

export async function OPTIONS() {
  const response = new Response('', { headers })
  return response
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queueName = searchParams.get('queueName')
  const jobId = searchParams.get('jobId')

  try {
    const response = await fetch(
      `${process.env.KONG_API}/mq/job?queueName=${queueName}&jobId=${jobId}`, 
      { headers: { ...KONG_API_HEADERS } 
    })

    const job = await response.json()
    return new Response(JSON.stringify(job), { headers })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to get job' }, { headers, status: 500 })

  }
}
