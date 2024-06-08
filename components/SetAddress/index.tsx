'use client'

import { z } from 'zod'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { springs } from '@/lib/motion'
import Button from '@/components/elements/Button'
import { fEvmAddress } from '@/lib/format'
import { UseSimulateContractParameters, useAccount, useReadContracts, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { getAddress, zeroAddress } from 'viem'
import InputAddress from '@/components/InputAddress'
import { InputAddressProvider, useInputAddress } from '@/components/InputAddress/provider'
import ExploreHash from '../ExploreHash'
import { EvmAddress, EvmAddressSchema, PSEUDO_ROLES } from '@/lib/types'
import { useMounted } from '@/hooks/useMounted'

function useWrite(
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
  }), [contract, next, enabled])
  const simulation = useSimulateContract(parameters)
  const write = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation }
}

function Component({
  label,
  verb,
  roleMask,
  contract,
  className
}: {
  label: ReactNode,
  verb: string,
  roleMask: bigint,
  contract: {
    address: EvmAddress,
    abi: any,
    get: string,
    set: string
  },
  className?: string 
}) {
  const { isConnected, address } = useAccount()
  const [previous, setPrevious] = useState<EvmAddress | undefined>(undefined)
  const [roles, setRoles] = useState<bigint | undefined>(undefined)

  const multicall = useReadContracts({ contracts: [
    { address: contract.address, abi: contract.abi, functionName: contract.get },
    { address: contract.address, abi: contract.abi, functionName: 'role_manager' },
    { address: contract.address, abi: contract.abi, functionName: 'roles', args: [address ?? zeroAddress] }
  ], query: { enabled: isConnected }})

  useEffect(() => {
    if (address && multicall.isSuccess) {
      setPrevious(EvmAddressSchema.parse(multicall.data![0].result))
      const roleManager = EvmAddressSchema.parse(multicall.data![1].result)
      let mask = z.bigint({ coerce: true }).parse(multicall.data![2].result)
      if (roleManager === address) { mask |= PSEUDO_ROLES.ROLE_MANAGER }
      setRoles(mask)
    } else {
      setPrevious(undefined)
      setRoles(undefined)
    }
  }, [address, multicall, setPrevious, setRoles])

  const permitted = useMemo(() => Boolean(roles && (roles & roleMask) === roleMask), [roles, roleMask])

  const { 
    next, setNext, 
    isValid, setIsValid 
  } = useInputAddress()

  useEffect(() => setNext(previous ?? ''), [previous])

  const changed = useMemo(() => Boolean(((previous || next) && (previous !== next))), [previous, next])
  const [error, setError] = useState<string | undefined>(undefined)
  const mounted = useMounted()

  const { 
    simulation, write, confirmation 
  } = useWrite(contract, next, isConnected && changed && isValid)

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
    if (multicall.isFetching) return 'sim'
    return 'default'
  }, [multicall])

  const disableInput = useMemo(() => 
    !permitted
    || multicall.isFetching,
  [multicall])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const disableButton = useMemo(() => 
    !permitted
    || !isValid 
    || !changed
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [isValid, changed, simulation, write, confirmation])

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
  }, [previous, next, write, confirmation, error])

  return <div className={`w-full flex flex-col gap-2 ${className}`}>
    <div className="text-neutral-400">{label}</div>
    <div className="flex items-center gap-4">
      <InputAddress onChange={onChange} theme={inputTheme} disabled={disableInput} />
      <Button onClick={onClick} theme={buttonTheme} disabled={disableButton} className="py-6">{verb}</Button>
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
  label: ReactNode,
  verb: string,
  roleMask: bigint,
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
