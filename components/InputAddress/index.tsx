import { useCallback, useEffect, useRef, useState } from 'react'
import Input from '../elements/Input'
import { EvmAddressSchema } from '@/lib/types'
import { PiWarningCircle } from 'react-icons/pi'
import { useInputAddress } from './provider'

export default function InputAddress({ 
  placeholder,
  disabled,
  onChange,
  theme, 
  className
}: { 
  placeholder?: string,
  disabled?: boolean,
  onChange?: (next: string, isValid: boolean) => void,
  theme?: 'default' | 'sim' | 'write' | 'confirm',
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [hasInput, setHasInput] = useState(false)
  const { 
    next, setNext, 
    isValid, setIsValid 
  } = useInputAddress()

  const _onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHasInput(e.target.value.length > 0)
    setNext(e.target.value)
    setIsValid(EvmAddressSchema.safeParse(e.target.value).success)
    onChange?.(e.target.value, EvmAddressSchema.safeParse(e.target.value).success)
  }, [setHasInput, setNext, setIsValid, onChange])

  useEffect(() => setIsValid(EvmAddressSchema.safeParse(next).success), [next])

  return <div className={`grow group relative rounded-primary ${className}`}>
    <Input
      ref={ref}
      type="text"
      value={next}
      onChange={_onChange}
      placeholder={placeholder ?? '0x'}
      disabled={disabled ?? false}
      theme={theme}
      maxLength={42}
      className="w-full text-base" />
    {hasInput && !isValid && <div className={`
      absolute top-0 right-4 h-full flex items-center text-yellow-400`}>
      <PiWarningCircle />
      </div>}
  </div>
}
