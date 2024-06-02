'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { springs } from '@/lib/motion'
import Button from '@/components/elements/Button'
import { EvmAddress } from '@/lib/types'
import { fEvmAddress } from '@/lib/format'
import { UseSimulateContractParameters, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import abis from '@/lib/abis'
import { getAddress, zeroAddress } from 'viem'
import InputAddress from '@/components/InputAddress'
import { InputAddressProvider, useInputAddress } from '@/components/InputAddress/provider'

function useContract(next: string | undefined, enabled: boolean) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    address: '0x28F53bA70E5c8ce8D03b1FaD41E9dF11Bb646c36',
    args: [getAddress(enabled ? next! : zeroAddress)],
    abi: abis.vault,
    functionName: 'set_accountant',
    query: { enabled }
  }), [next, enabled])
  const simulation = useSimulateContract(parameters)
  const write = useWriteContract()
  const writeReceipt = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, writeReceipt }
}

function Provided({ previous, className }: { previous?: EvmAddress, className?: string }) {
  const { 
    next, setNext, 
    isValid, setIsValid 
  } = useInputAddress()

  const changed = useMemo(() => Boolean(((previous || next) && (previous !== next))), [previous, next])
  const [error, setError] = useState<string | undefined>(undefined)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const onChange = useCallback((next: string, isValid: boolean) => {
    setNext(next)
    setIsValid(isValid)
    setError(undefined)
  }, [setNext, setIsValid, setError])

  const { simulation, write: { writeContract }, writeReceipt } = useContract(next, changed && isValid)

  const subtext = useMemo(() => {
    if (error) {
      return {
        key: 'error',
        text: <div className="inline text-red-400">{error}</div>
      }
    }

    if (previous && previous !== next) { 
      return {
        key: 'next',
        text: <div onClick={() => setNext(previous)} className="inline cursor-pointer">{`previously ${fEvmAddress(previous)}`}</div>
      }
    }

    return {
      key: 'default',
      text: <>&nbsp;</>
    }
  }, [previous, next, simulation, writeReceipt, error])

  useEffect(() => {
    if (simulation.isError) {
      setError(`This will revert, see console for details.`)
      console.error(simulation.error.message)
    }
  }, [simulation, setError])

  const disabled = useMemo(() => 
    !isValid 
    || !changed
    || simulation.isFetching
    || !simulation.isSuccess,
  [isValid, changed, simulation])

  const onClick = useCallback(() => {
    if (disabled) return
    writeContract(simulation.data!.request, {
      onSettled: () => {}
    })
  }, [disabled, writeContract, simulation])

  const buttonTheme = useMemo(() => {
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation])

  return <div className={`w-full flex flex-col gap-2 ${className}`}>
    <div className="text-neutral-400">Accountant</div>
    <div className="flex items-center gap-4">
      <InputAddress onChange={onChange} />
      <Button onClick={onClick} theme={buttonTheme} disabled={disabled} className="py-6">{'Set'}</Button>
    </div>
    <div className={`pl-3 text-xs text-neutral-400`}>
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

export default function SetAddress({ previous, className }: { previous?: EvmAddress, className?: string }) {
  return <InputAddressProvider previous={previous}>
    <Provided previous={previous} className={className} />
  </InputAddressProvider>
}
