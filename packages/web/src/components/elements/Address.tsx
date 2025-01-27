import { useCallback, useEffect, useRef, useState } from 'react'
import Input from './Input'
import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { PiCheckCircle, PiWarningCircle } from 'react-icons/pi'

export default function Address({ 
  placeholder,
  disabled,
  frozen,
  onChange,
  previous,
  next,
  setNext,
  isNextValid,
  setIsNextValid,
  infoKey,
  theme = 'default',
  className
}: { 
  placeholder?: string,
  disabled?: boolean,
  frozen?: boolean,
  onChange?: (next: string, isValid: boolean) => void,
  previous?: EvmAddress,
  next?: string,
  setNext?: (next: string) => void,
  isNextValid?: boolean,
  setIsNextValid?: (isValid: boolean) => void,
  infoKey?: string,
  theme?: 'default' | 'warn' | 'error',
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [hasNext, setHasNext] = useState(false)

  const _onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (frozen) return
    setHasNext(e.target.value.length > 0)
    setNext?.(e.target.value)
    const parseable = EvmAddressSchema.safeParse(e.target.value).success
    setIsNextValid?.(parseable)
    onChange?.(e.target.value, parseable)
  }, [frozen, setHasNext, setNext, setIsNextValid, onChange])

  useEffect(() => setIsNextValid?.(EvmAddressSchema.safeParse(next).success), [setIsNextValid, next])

  return <div className={`grow group relative rounded-primary ${className}`}>
    <Input
      ref={ref}
      type="text"
      value={next ?? previous ?? ''}
      onChange={_onChange}
      placeholder={placeholder ?? '0x'}
      disabled={disabled ?? false}
      infoKey={infoKey}
      maxLength={42}
      theme={theme}
      className="w-full text-base" />
    {!infoKey && hasNext && !isNextValid && <div className={`
      absolute top-0 right-4 h-full flex items-center text-yellow-400`}>
      <PiWarningCircle />
    </div>}
    {!infoKey && hasNext && isNextValid && <div className={`
      absolute top-0 right-4 h-full flex items-center text-green-400`}>
      <PiCheckCircle />
    </div>}
  </div>
}
