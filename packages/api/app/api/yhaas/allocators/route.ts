import '@/lib/global'
import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { NextResponse } from 'next/server'
import { createPublicClient, http, PublicClient } from 'viem'
import { chains, getRpc } from '@kalani/lib/chains'
import abis from '@kalani/lib/abis'

export async function isYVault(client: PublicClient, address: EvmAddress) {
  const multicall = await client.multicall({
    contracts: [
      { address, abi: abis.vault, functionName: 'apiVersion' },
      { address, abi: abis.vault, functionName: 'role_manager' }
    ]
  })
  return multicall[0].status === 'success' && multicall[1].status === 'success'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chainId = parseInt(searchParams.get('chainId') ?? '0')
  if (!chains[chainId]) { return NextResponse.json({ error: `Bad chainId, ${chainId}` }, { status: 400 }) }
  const { success: addressSuccess, data: address } = EvmAddressSchema.safeParse(searchParams.get('vault'))
  if (!addressSuccess) { return NextResponse.json({ error: `Bad address, ${address}` }, { status: 400 }) }

  const chain = chains[chainId]
  const client = createPublicClient({ chain, transport: http(getRpc(chainId)) })
  if (!await isYVault(client, address)) { return NextResponse.json({ error: `Not a yVault, ${address}` }, { status: 400 }) }

  // does a vault thing exist, and what are its allocators

  // if not, kick off indexer

  // if yes, return allocators

  try {


    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch allocators' }, { status: 500 })
  }
}
