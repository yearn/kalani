import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { generateNonce } from 'siwe'
import { SessionData, sessionOptions } from '../session'

async function handler() {  
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.nonce = await generateNonce()
  await session.save()
  return NextResponse.json({ nonce: session.nonce })
}

export { handler as GET }
