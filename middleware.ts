import { getIronSession } from 'iron-session'
import { NextRequest, NextResponse } from 'next/server'
import { SessionData, sessionOptions } from './app/api/siwe/session'
import { cookies } from 'next/headers'

export const config = {
  matcher: [
    '/api/user/:function*',
    '/api/whitelist/:function*'
  ],
}

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  if(!session.siwe?.success) return new NextResponse(null, { status: 401 })

  const expired = new Date(session.siwe.data.expirationTime || '') < new Date()
  if(expired) return new NextResponse(null, { status: 401 })

  return NextResponse.next()
}
