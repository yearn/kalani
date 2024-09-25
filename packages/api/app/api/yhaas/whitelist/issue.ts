import { chains } from '@kalani/lib/chains' 
import { Application } from './types'
import { capitalize } from '@kalani/lib/strings'

function makeOptionsMarkdown(application: Application) {
  const { chainId, targets, options } = application
  const chain = chains[chainId]
  const targetType = targets[0].targetType

  if (targetType === 'vault') {
    return `- [${Boolean(options.automate) ? 'x' : ' '}] automate debt allocator [${options.allocator}](${chain.blockExplorers?.default.url}/address/${options.allocator})`
  }

  return ''
}

export default function makeIssueMarkdown(application: Application) {
  const { chainId, targets, repo, frequency, options } = application
  const chain = chains[chainId]
  const targetType = targets[0].targetType

  return `
**${capitalize(targetType)} name${targets.length > 1 ? 's' : ''}**
${targets.map(target => target.name).join('\n')}

**Network**
${chain?.name}

**Link to ${targetType} repository/issue**
${repo.startsWith('https://') ? repo : `https://${repo}`}

**${capitalize(targetType)} address${targets.length > 1 ? 'es' : ''}**
${targets.map(target => 
  `[${target.address}](${chain.blockExplorers?.default.url}/address/${target.address})`
).join('\n')}

**Options**
${makeOptionsMarkdown(application)}

**Automation frequency**
${frequency} ${frequency === 1 ? 'day' : 'days'}
`
}
