'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { springs } from '@/lib/motion'
import Button from '@/components/elements/Button'
import { fEvmAddress } from '@/lib/format'
import { UseSimulateContractParameters, useAccount, useReadContract, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { getAddress, zeroAddress } from 'viem'
import InputAddress from '@/components/InputAddress'
import { InputAddressProvider, useInputAddress } from '@/components/InputAddress/provider'
import ExploreHash from './ExploreHash'
import { EvmAddress, EvmAddressSchema } from '@/lib/types'

function useContract(
  contract: {
    address: EvmAddress,
    abi: any,
    get: string,
    set: string
  }, 
  next: string | undefined, 
  enabled: boolean
) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    address: contract.address,
    args: [getAddress(enabled ? next! : zeroAddress)],
    abi: contract.abi,
    functionName: contract.set,
    query: { enabled }
  }), [next, enabled])
  const simulation = useSimulateContract(parameters)
  const write = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation }
}

function Component({ 
  contract,
  className
}: {
  contract: {
    address: EvmAddress,
    abi: any,
    get: string,
    set: string
  },
  className?: string 
}) {
  const { isConnected } = useAccount()

  const [previous, setPrevious] = useState<EvmAddress | undefined>(undefined)
  const { data: _previous, isFetching: isFetchingPrevious } = useReadContract({
    address: contract.address,
    abi: contract.abi,
    functionName: contract.get
  })
  useEffect(() => setPrevious(_previous ? EvmAddressSchema.parse(_previous) : undefined), [_previous])

  const { 
    next, setNext, 
    isValid, setIsValid 
  } = useInputAddress()

  useEffect(() => setNext(previous ?? ''), [previous])

  const changed = useMemo(() => Boolean(((previous || next) && (previous !== next))), [previous, next])
  const [error, setError] = useState<string | undefined>(undefined)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { 
    simulation, write, confirmation 
  } = useContract(contract, next, isConnected && changed && isValid)

  useEffect(() => {
    if (confirmation.isSuccess) {
      setPrevious(EvmAddressSchema.parse(next))
    }
  }, [confirmation, setPrevious, next])

  const onChange = useCallback((next: string, isValid: boolean) => {
    setNext(next)
    setIsValid(isValid)
    setError(undefined)
    write.reset()
  }, [setNext, setIsValid, setError, write])

  useEffect(() => {
    if (simulation.isError) {
      setError(`This will revert, see console for details.`)
      console.error(simulation.error.message)
    }
  }, [simulation, setError])

  const inputTheme = useMemo(() => {
    if (isFetchingPrevious) return 'sim'
    return 'default'
  }, [isFetchingPrevious])

  const disableInput = useMemo(() => isFetchingPrevious, [isFetchingPrevious])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const disableButton = useMemo(() => 
    !isValid 
    || !changed
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [isValid, changed, simulation, write])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  const subtext = useMemo(() => {
    if (error) return {
      key: 'error',
      text: <div className="text-red-400">{error}</div>
    }

    if (confirmation.isSuccess) return {
      key: 'confirmed',
      text: <ExploreHash hash={write.data!} message="Confirmed!" />
    }

    if (write.isSuccess && confirmation.isPending) return {
      key: 'confirmation',
      text: <ExploreHash hash={write.data!} message="Confirming..." />
    }

    if (previous && previous !== next) return {
      key: 'next',
      text: <div onClick={() => setNext(previous)} className="inline cursor-pointer">{`previously ${fEvmAddress(previous)}`}</div>
    }

    return {
      key: 'default',
      text: <>&nbsp;</>
    }
  }, [previous, next, simulation, write, confirmation, error])

  return <div className={`w-full flex flex-col gap-2 ${className}`}>
    <div className="text-neutral-400">Accountant</div>
    <div className="flex items-center gap-4">
      <InputAddress onChange={onChange} theme={inputTheme} disabled={disableInput} />
      <Button onClick={onClick} theme={buttonTheme} disabled={disableButton} className="py-6">{'Set'}</Button>
    </div>
    <div className={`pl-3 text-xs text-neutral-400`}>
      <motion.div key={subtext.key}
        transition={springs.roll}
        initial={mounted ? { x: 40, opacity: 0 } : false}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}>
        {subtext.text}
      </motion.div>
    </div>
  </div>
}

export default function SetAddress(props: {
  contract: {
    address: EvmAddress,
    abi: any,
    get: string,
    set: string
  },
  disabled?: boolean,
  className?: string 
}) {
  return <InputAddressProvider>
    <Component {...props} />
  </InputAddressProvider>
}
