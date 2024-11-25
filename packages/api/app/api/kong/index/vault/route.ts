import '@/lib/global'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import { CORS_HEADERS } from '../../../headers'
import { EvmAddressSchema, HexStringSchema } from '@kalani/lib/types'
import { getRpc } from '@kalani/lib/chains'
import { http } from 'viem'
import { createPublicClient } from 'viem'
import { chains } from '@kalani/lib/chains'
import abis from '@kalani/lib/abis'
import { extractLogs, extractSnapshot, postThing } from '../../lib'

const headers = { ...CORS_HEADERS }

const RequestDataSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  asset: EvmAddressSchema,
  decimals: z.number(),
  apiVersion: z.string(),
  category: z.number(),
  projectId: HexStringSchema,
  projectName: z.string(),
  roleManager: EvmAddressSchema,
  inceptBlock: z.bigint({ coerce: true }),
  inceptTime: z.number(),
  signature: HexStringSchema
})

type RequestData = z.infer<typeof RequestDataSchema>

export async function OPTIONS() {
  const response = new Response('', { headers })
  return response
}

async function verifySignature(data: RequestData) {
  const { chainId, address, roleManager, signature } = data
  const chain = chains[chainId]
  const client = createPublicClient({ chain, transport: http(getRpc(chainId)) })
  const onchainRoleManager = await client.readContract({
    abi: abis.vault, address, functionName: 'role_manager'
  })

  if (onchainRoleManager !== roleManager) {
    return {
      verified: false,
      response: NextResponse.json({ error: 'Bad role manager' }, { headers, status: 400 })
    }
  }

  const chad = await client.readContract({
    abi: abis.roleManager, address: onchainRoleManager, functionName: 'chad'
  })

  const message = `Hi, please index my vault, ${address}. Thank you!`
  const verified = await client.verifyMessage({
    message,
    signature,
    address: chad
  })

  if (!verified) {
    return {
      verified: false,
      response: NextResponse.json({ error: 'Bad signature' }, { headers, status: 400 })
    }
  }

  return {
    verified: true,
    response: undefined
  }
}

export async function POST(request: Request) {
  const data = RequestDataSchema.parse(await request.json())

  const { verified, response } = await verifySignature(data)
  if (!verified) { return response }

  const { 
    chainId, address, 
    asset, decimals, apiVersion, category,
    projectId, projectName, roleManager, 
    inceptBlock, inceptTime 
  } = data

  await postThing(chainId, address, 'vault', {
    erc4626: true, v3: true, yearn: false,
    asset, decimals, apiVersion, category,
    projectId, projectName, roleManager,
    inceptBlock, inceptTime
  })

  await extractLogs('yearn/3/vault', chainId, address, inceptBlock - 1n, inceptBlock + 1n)

  await extractSnapshot('yearn/3/vault', chainId, address)

  return new Response(JSON.stringify({ ok: true }), { headers })
}
