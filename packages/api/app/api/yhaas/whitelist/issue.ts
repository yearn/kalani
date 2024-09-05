import { chains } from './chains'
import { Application } from './types'
import { capitalize } from '@/lib/strings'

export default function makeIssueMarkdown(application: Application) {
  const { chainId, target, targetType, name, repo, frequency } = application
  const chain = chains[chainId]
  const targetTypeCapitalized = capitalize(targetType)

  return `
**Strategy name**
${name}

**Network**
${chain?.name}

**Link to ${targetType} repository/issue**
${repo}

**${targetTypeCapitalized} address**
${`[${chain.blockExplorers?.default.url}/address/${target}](${chain.blockExplorers?.default.url}/address/${target})`}

**Automation frequency**
${frequency} ${frequency === 1 ? 'day' : 'days'}
`
}
