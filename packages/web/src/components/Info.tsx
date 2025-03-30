import { Tooltip } from 'react-tooltip'
import { PiInfoFill } from 'react-icons/pi'
import Markdown from 'react-markdown'
import { cn } from '../lib/shadcn'
import { useString } from '../strings/useString'

export default function Info({ _key, size = 16, className }: { _key: string, size?: number, className?: string }) {
  const info = useString(_key)
  return <div className={cn('isolate z-[10000] flex text-neutral-600 hover:text-secondary-50 pointer-events-auto', className)}>
    <a data-tooltip-id={_key}>
      <PiInfoFill size={size} />
    </a>
    <Tooltip id={_key} className="!bg-secondary-900 !opacity-100 !rounded-primary">
      <Markdown className="markdown max-w-[320px]">{info}</Markdown>
    </Tooltip>
  </div>
}
