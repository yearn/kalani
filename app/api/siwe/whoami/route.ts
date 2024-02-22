import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '../session'

async function handler() {  
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  return NextResponse.json({ address: session.siwe?.data.address || null })
}

export { handler as GET }
