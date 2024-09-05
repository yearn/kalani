import { fetchAllOpenIssues, postIssue } from '@/lib/gh'
import { NextResponse } from 'next/server'
import { createPublicClient, http, parseAbi } from 'viem'
import { chains, getRpc } from './chains'
import makeIssueMarkdown from './issue'
import { ApplicationSchema } from './types'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  const response = new Response('', { headers })
  return response
}

export async function POST(req: Request) {
  const application = ApplicationSchema.parse(await req.json())
  const {
    title,
    chainId,
    manager,
    target,
    signature
  } = application

  console.log(application)

  const chain = chains[chainId]
  const client = createPublicClient({ chain, transport: http(getRpc(chainId)) })

  const verified = await client.verifyMessage({
    message: `I manage contract ${target}`,
    signature,
    address: manager
  })

  if (!verified) {
    return NextResponse.json({ message: 'Bad signature' }, { status: 500, headers })
  }

  const multicall = await client.multicall({
    contracts: [
      {
        abi: parseAbi(['function management() view returns (address)']),
        address: target, functionName: 'management'
      },
      {
        abi: parseAbi(['function role_manager() view returns (address)']),
        address: target, functionName: 'role_manager'
      }
    ]
  })

  const isManager = multicall[0].result === manager || multicall[1].result === manager

  if (!isManager) {
    return NextResponse.json({ message: `${manager} is not the manager of ${target}` }, { status: 500, headers })
  }

  const issues = await fetchAllOpenIssues()
  const issueExists = issues.some(issue => issue.title === title)
  if (issueExists) {
    return NextResponse.json({ message: `An application for "${title}" already exists` }, { status: 500, headers })
  }

  const md = makeIssueMarkdown(application)
  const { url, html_url, labels, state } = await postIssue(title, md, [chain.name.toLowerCase()])

  await new Promise(resolve => setTimeout(resolve, 3000))
  return NextResponse.json({ message: 'OK', url, html_url, labels, state }, { headers })
}
