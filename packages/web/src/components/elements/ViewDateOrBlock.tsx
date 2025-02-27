import { fBlockTime } from '@kalani/lib/format'
import { useCallback, useMemo } from 'react'
import ReactTimeago from 'react-timeago'
import useLocalStorage from 'use-local-storage'
import { cn } from '../../lib/shadcn'

function useDateOrBlockSettings() {
  const [setting, setSetting] = useLocalStorage('date-or-block', 'date')
  const next = useCallback(() => {
    const options = ['date', 'time ago', 'timestamp', 'block']
    const index = (options.indexOf(setting) + 1) % options.length
    setSetting(options[index])
  }, [setting, setSetting])
  return { setting, next }
}

function useDateOrBlockFormat(timestamp: number, block: number | bigint) {
  const { setting } = useDateOrBlockSettings()
  const format = useMemo(() => {
    switch (setting) {
      case 'date': return fBlockTime(timestamp)
      case 'time ago': return <ReactTimeago date={timestamp * 1000} />
      case 'timestamp': return timestamp
      case 'block': return Number(block)
      default: return fBlockTime(timestamp)
    }
  }, [setting, timestamp, block])
  return format
}

export default function ViewDateOrBlock({ timestamp, block, className }: { timestamp: number, block: number | bigint, className?: string }) {
  const { setting, next } = useDateOrBlockSettings()
  const format = useDateOrBlockFormat(timestamp, block)
  return <div onClick={next} title={setting} className={cn('px-3 py-1 inline-flex items-center rounded-full cursor-pointer whitespace-nowrap', className)}>
    {format}
  </div>
}
