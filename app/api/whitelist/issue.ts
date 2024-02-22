import { networks } from '@/lib/networks'

export default function makeIssueMarkdown(
  name: string, 
  chainId: number, 
  addresses: `0x${string}`[], 
  repo: string, 
  frequency: string
) {
  const network = networks(chainId)

  const addressBlock = addresses.map(address => 
    `[${network.blockExplorers.default.url}/address/${address}](${network.blockExplorers.default.url}/address/${address})\n\n`
  ).join('')

  return `
**Strategy name**
${name}

**Network**
${network?.name}

**Strategy repo**
${repo}

**Strategy\\factory addresses**
${addressBlock}

**Automation frequency**
${frequency}
`
}
