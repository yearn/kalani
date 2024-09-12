import { chains } from '@kalani/lib/chains' 
import { Application } from './types'
import { capitalize } from '@kalani/lib/strings'

export default function makeIssueMarkdown(application: Application) {
  const { chainId, targets, repo, frequency } = application
  const chain = chains[chainId]
  const targetType = targets[0].targetType

  return `
**${capitalize(targetType)} name${targets.length > 1 ? 's' : ''}**
${targets.map(target => target.name).join('\n')}

**Network**
${chain?.name}

**Link to ${targetType} repository/issue**
${repo}

**${capitalize(targetType)} address${targets.length > 1 ? 'es' : ''}**
${targets.map(target => 
  `[${target.address}](${chain.blockExplorers?.default.url}/address/${target.address})`
).join('\n')}

**Automation frequency**
${frequency} ${frequency === 1 ? 'day' : 'days'}
`
}
