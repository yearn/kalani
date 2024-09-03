import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log('req.body', req.body)
  await new Promise(resolve => setTimeout(resolve, 3000))
  return NextResponse.json({ message: "Waited for 3 seconds" })
}
