import { useCallback, useMemo } from 'react'
import Input from './Input'
import { cn } from '../../lib/shadcn'
import useLocalStorage from 'use-local-storage'

export function useInputBpsSettings() {
  const options = ['bps', '%']
  const [setting, setSetting] = useLocalStorage('input-bps', '%')
  const next = useCallback(() => {
    const index = (options.indexOf(setting) + 1) % options.length
    setSetting(options[index])
  }, [setting, setSetting])
  return { setting, next }
}

export default function InputBps({
  bps,
  disabled,
  onChange,
  className,
  isValid,
  validationMessage
}: {
  bps?: number | string | undefined,
  disabled?: boolean,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string,
  isValid?: boolean,
  validationMessage?: string
}) {
  const { setting, next } = useInputBpsSettings()
  const isPercentMode = useMemo(() => setting === '%', [setting])
  const max = useMemo(() => isPercentMode ? 100 : 10_000, [isPercentMode])

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault()
    }
  }, [])

  const displayValue = useMemo(() => {
    return isPercentMode 
      ? (100.0 * (Math.floor((Number(bps) ?? 0)) / 10_000.0)).toFixed(2).toString() 
      : bps?.toString() ?? ''
  }, [isPercentMode, bps])

  const _onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value < 0 || value > max) return

    const bpsValue = isPercentMode ? Math.floor((value / 100) * 10_000) : value
    if (onChange) {
      onChange({
        ...e,
        target: { ...e.target, value: bpsValue.toString() }
      })
    }
  }, [isPercentMode, onChange, max])

  return <div className="group relative">
    <Input
      disabled={disabled}
      value={displayValue}
      type="number"
      theme={isValid ? 'default' : 'error'}
      onChange={_onChange}
      onKeyDown={onKeyDown}
      className={className}
      />
    <div className={cn(`
      absolute inset-0 pr-14
      flex items-center justify-end
      pointer-events-none`)}>
      <button 
        className={`px-6 py-1 text-lg
          bg-neutral-900 text-neutral-600 hover:text-neutral-50 
          rounded-full cursor-pointer pointer-events-auto`}
        onClick={next}
        disabled={disabled}>
        {setting}
      </button>
    </div>
    <div className={cn('absolute right-0 -bottom-6 text-error-500 text-xs whitespace-nowrap', isValid ? 'hidden' : '')}>
      {validationMessage}
    </div>
  </div>
}
