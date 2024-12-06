import { zeroAddress } from 'viem'

export async function GET(request: Request, { params }: { params: { chainId: string, address: string } }) {
  const { chainId, address } = params

  const url = `${process.env.SMOL_ASSETS}/api/token/${chainId}/${address ?? zeroAddress}/logo-128.png`
  const response = await fetch(url)

  if (response.status !== 200) {
    console.error(`Failed to fetch token image for ${chainId}/${address ?? zeroAddress}`)

    const transparentPngBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wQAAwEB/wv05QEAAAAASUVORK5CYII='
    const transparentPngBuffer = Buffer.from(transparentPngBase64, 'base64')

    return new Response(transparentPngBuffer, { headers: { 'Content-Type': 'image/png' }, status: 200 })
  }

  return response
}
