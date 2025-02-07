import { useCallback, useMemo, useState } from 'react'
import Input from './Input'
import { cn } from '../../lib/shadcn'

export default function InputSeconds({
  seconds,
  disabled,
  startInDaysMode,
  onChange,
  className,
  isValid,
  validationMessage
}: {
  seconds?: number | string | undefined,
  disabled?: boolean,
  startInDaysMode?: boolean,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string,
  isValid?: boolean,
  validationMessage?: string
}) {
  const [isDaysMode, setIsDaysMode] = useState(startInDaysMode || false)
  const secondsPerDay = 60 * 60 * 24

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault()
    }
  }, [])

  const displayValue = useMemo(() => {
    return isDaysMode 
      ? Math.floor((Number(seconds) || 0) / secondsPerDay).toString() 
      : seconds?.toString() || ''
  }, [isDaysMode, seconds, secondsPerDay])

  const _onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const secondsValue = isDaysMode ? Number(value) * secondsPerDay : Number(value)
    if (onChange) {
      onChange({
        ...e,
        target: { ...e.target, value: secondsValue.toString() }
      })
    }
  }, [isDaysMode, onChange, secondsPerDay])

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
        className={`px-3 py-1 
          bg-neutral-900 text-neutral-600 hover:text-neutral-50 
          rounded-full cursor-pointer pointer-events-auto`}
        onClick={() => setIsDaysMode(current => !current)}
        disabled={disabled}
      >
        {isDaysMode ? 'days' : 'seconds'}
      </button>
    </div>
    <div className={cn('absolute right-0 -bottom-6 text-error-500 text-xs whitespace-nowrap', isValid ? 'hidden' : '')}>
      {validationMessage}
    </div>
  </div>
}