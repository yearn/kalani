'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { springs } from '@/lib/motion'
import Button from '@/components/elements/Button'
import Input from '@/components/elements/Input'
import { EvmAddress, EvmAddressSchema } from '@/lib/types'
import { PiWarningCircle } from 'react-icons/pi'
import { fEvmAddress } from '@/lib/format'

export default function WriteAddress({ previous, className }: { previous?: EvmAddress, className?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [hasInput, setHasInput] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [isError, setIsError] = useState(false)
  const [next, setNext] = useState<string | undefined>(previous)
  const disabled = useMemo(() => !(hasInput && isValid) || (next === previous), [hasInput, isValid, next, previous])
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHasInput(e.target.value.length > 0)
    setNext(e.target.value)
  }, [setHasInput, setNext])

  useEffect(() => {
    const valid = EvmAddressSchema.safeParse(next).success
    setIsValid(valid)
  }, [next, previous, setIsValid])

  const subtext = useMemo(() => {
    if (previous && previous !== next) { 
      return {
        key: 'next',
        text: <div onClick={() => setNext(previous)} className="cursor-pointer">{`previously ${fEvmAddress(previous)}`}</div>
      }
    } else {
      return {
        key: 'default',
        text: <>&nbsp;</>
      }
    }
  }, [hasInput, previous, next])

  return <div className={`w-full flex flex-col gap-2 ${className}`}>
    <div className="text-neutral-400">Accountant</div>
    <div className="flex items-center gap-4">
      <div className="grow group relative">
        <Input 
          ref={ref} 
          type="text"
          value={next}
          onChange={onChange} 
          placeholder={'Accountant address'} 
          className="w-full text-base" />
        {hasInput && !isValid && <div className={`
          absolute top-0 right-4 h-full flex items-center text-yellow-400`}>
          <PiWarningCircle />
          </div>}
      </div>
      <Button disabled={disabled} className="py-6">{'Set'}</Button>
    </div>

    <div className={`pl-3 font-thin text-xs ${isError ? 'text-charge-yellow' : 'opacity-70'}`}>
      <motion.div key={subtext.key}
        transition={springs.roll}
        initial={mounted ? { x: 40, opacity: 0 } : false}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }} >
        {subtext.text}
      </motion.div>
    </div>
  </div>
}
