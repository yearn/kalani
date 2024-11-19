import { useCallback } from 'react'
import Input from './Input'
import { cn } from '../../lib/shadcn'

export default function InputInteger({
  value,
  disabled,
  onChange,
  className,
  isValid,
  validationMessage
}: {
  value?: number | string | undefined,
  disabled?: boolean,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string,
  isValid?: boolean,
  validationMessage?: string
}) {
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault()
    }
  }, [])

  const _onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (onChange) {
      onChange({
        ...e,
        target: { ...e.target, value }
      })
    }
  }, [onChange])

  return <div className="group relative">
    <Input
      disabled={disabled}
      value={value}
      type="number"
      theme={isValid ? 'default' : 'error'}
      onChange={_onChange}
      onKeyDown={onKeyDown}
      className={className}
      />
    <div className={cn('absolute right-0 -bottom-6 text-error-500 text-xs whitespace-nowrap', isValid ? 'hidden' : '')}>
      {validationMessage}
    </div>
  </div>
}