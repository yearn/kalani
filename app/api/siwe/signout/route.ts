import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '../session'
import { db } from '../../db'

async function handler() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  const { nonce } = session
  await session.destroy()
  await db.query(`INSERT INTO nonce_bin (nonce) VALUES ($1);`, [nonce])
  return NextResponse.json({ ok: true })
}

export { handler as POST }
