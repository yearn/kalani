import { postIssue } from '@/lib/gh'
import { fEvmAddress } from '@kalani/lib/format'
import { NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { chains, getRpc } from '@kalani/lib/chains'
import makeIssueMarkdown from './issue'
import { ApplicationSchema } from './types'
import { generateTitle } from './title'
import { CORS_HEADERS } from '../../headers'

const headers = { ...CORS_HEADERS }

export async function OPTIONS() {
  const response = new Response('', { headers })
  return response
}

export async function POST(req: Request) {
  const application = ApplicationSchema.parse(await req.json())

  const {
    chainId,
    manager,
    targets,
    signature,
    options
  } = application

  const chain = chains[chainId]
  const client = createPublicClient({ chain, transport: http(getRpc(chainId)) })

  const targetList = targets.map(target => target.address).join('\n')
  const verified = await client.verifyMessage({
    message: `I manage these contracts:\n${targetList}`,
    signature,
    address: manager
  })

  if (!verified) {
    return NextResponse.json({ message: 'Bad signature!' }, { status: 500, headers })
  }

  const title = await generateTitle(targets.map(target => target.name))
  if (!title) {
    return NextResponse.json({ message: 'No title!' }, { status: 500, headers })
  }

  const md = makeIssueMarkdown(application)
  const { url, html_url, labels, state } = await postIssue(
    `${title} [${fEvmAddress(manager)}]`, md, [chain.name.toLowerCase()]
  )

  await new Promise(resolve => setTimeout(resolve, 3000))
  return NextResponse.json({ message: 'OK', url, html_url, labels, state }, { headers })
}
