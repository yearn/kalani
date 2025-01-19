import { Tooltip } from 'react-tooltip'
import { PiInfoFill } from 'react-icons/pi'
import Markdown from 'react-markdown'
import { cn } from '../lib/shadcn'
import { useInfo } from '../hooks/useInfo'

// const INFO = {
//   'test': '# test \n\n *test*'
// } as const

// type InfoKey = keyof typeof INFO

// function useInfo(key: InfoKey) {
//   return useMemo(() => {
//     if (!INFO[key]) { throw new Error(`Info key not found, ${key}`) }
//     return INFO[key]
//   }, [key])
// }

export default function Info({ _key, size = 16, className }: { _key: string, size?: number, className?: string }) {
  const info = useInfo(_key)
  return <div className={cn('flex text-neutral-500 hover:text-secondary-50', className)}>
    <a data-tooltip-id={_key} className={cn('')}>
      <PiInfoFill size={size} />
    </a>
    <Tooltip id={_key}>
      <Markdown className="markdown">{info}</Markdown>
    </Tooltip>
  </div>
}
