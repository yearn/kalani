import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { SessionData, sessionOptions } from '../session'
import { db } from '../../db'

async function staleNonce(nonce: string) {
  const { rows } = await db.query(`SELECT * FROM nonce_bin WHERE nonce = $1;`, [nonce])
  return rows.length > 0
}

async function handler(request: NextRequest, response: NextResponse) {
  const { message, signature } = await request.json()
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  const siweMessage = new SiweMessage(message)
  const fields = await siweMessage.verify({signature})

  if(await staleNonce(fields.data.nonce)) {
    return NextResponse.json({ error: 'stale nonce' }, { status: 422 })
  }

  if (fields.data.nonce !== session.nonce) {
    return NextResponse.json({ error: 'bad nonce' }, { status: 422 })
  }

  session.siwe = fields
  await session.save()
  return NextResponse.json({ ok: true })
}

export { handler as POST }
