import { NextResponse } from 'next/server'
import { CORS_HEADERS, KONG_API_HEADERS } from '../../../headers'

const headers = { ...CORS_HEADERS }

export async function OPTIONS() {
  const response = new Response('', { headers })
  return response
}

export async function POST(request: Request) {
  try {
    // const { queueName, jobName, data, options } = await request.json()

    // const response = await fetch(`${process.env.KONG_API}/mq/add`, {
    //   method: 'POST', headers: { ...KONG_API_HEADERS },
    //   body: JSON.stringify({ queueName, jobName, data, options })
    // })

    // const { jobId } = await response.json()
    // return new Response(JSON.stringify({ queueName, jobId }), { headers })

    const { queueName } = await request.json()
    return new Response(JSON.stringify({ queueName, jobId: '0' }), { headers })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to add job' }, { headers, status: 500 })

  }
}
