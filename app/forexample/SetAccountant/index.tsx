import { EvmAddress, EvmAddressSchema, ROLES } from '@/lib/types'
import accountants, { TaggedAccountant } from './accountants'
import { UseSimulateContractParameters, useAccount, useReadContracts, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Combo } from './Combo'
import Button from '@/components/elements/Button'
import abis from '@/lib/abis'
import { z } from 'zod'
import { getAddress, zeroAddress } from 'viem'
import { useWriteContract } from '@/hooks/useWriteContract'

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
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export default function SetAccountant({ vault }: { vault: EvmAddress }) {
  const { isConnected, chainId, address } = useAccount()
  const [previous, setPrevious] = useState<EvmAddress | undefined>(undefined)
  const [next, setNext] = useState<string | undefined>(undefined)
  const [isNextValid, setIsNextValid] = useState<boolean>(false)
  const [roles, setRoles] = useState<bigint | undefined>(undefined)

  const filter = useMemo(() => {
    if (!isConnected) return []
    return accountants.filter((accountant: TaggedAccountant) => {
      return accountant.chainId === chainId
    })
  }, [isConnected, chainId])

  const multicall = useReadContracts({ contracts: [
    { address: vault, abi: abis.vault, functionName: 'accountant' },
    { address: vault, abi: abis.vault, functionName: 'roles', args: [address ?? zeroAddress] }
  ]})

  useEffect(() => {
    if (multicall.isSuccess) {
      setPrevious(EvmAddressSchema.parse(multicall.data![0].result))
      let mask = z.bigint({ coerce: true }).parse(multicall.data![1].result)
      setRoles(mask)
    } else {
      setPrevious(undefined)
      setRoles(undefined)
    }
  }, [multicall, setPrevious, setRoles])

  const permitted = useMemo(() => Boolean(roles && (roles & ROLES.ACCOUNTANT_MANAGER) === ROLES.ACCOUNTANT_MANAGER), [roles])

  useEffect(() => setNext(previous ?? ''), [setNext, previous])
  const changed = useMemo(() => Boolean(((previous || next) && (previous !== next))), [previous, next])

  const { 
    simulation, write, confirmation, resolveToast
  } = useWrite({
    abi: abis.vault,
    address: vault,
    get: 'accountant',
    set: 'set_accountant'
  }, next, isConnected && changed && isNextValid)

  const inputTheme = useMemo(() => {
    if (multicall.isFetching) return 'sim'
    return 'default'
  }, [multicall])

  const disableInput = useMemo(() => 
    !permitted
    || multicall.isFetching,
  [permitted, multicall])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const disableButton = useMemo(() => 
    !permitted
    || !isNextValid 
    || !changed
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [permitted, isNextValid, changed, simulation, write, confirmation])

  useEffect(() => {
    if (confirmation.isSuccess && EvmAddressSchema.safeParse(next).success) {
      setPrevious(EvmAddressSchema.parse(next))
      resolveToast()
      write.reset()
    }
  }, [confirmation, setPrevious, next, resolveToast, write])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <div className="w-full flex flex-col gap-2">
    <div className="text-neutral-400">Accountant</div>
    <div className="flex items-center gap-2">
      <div className={`grow theme-${inputTheme} p-1 rounded-primary`}>
        <Combo 
          previous={previous}
          next={next}
          setNext={setNext}
          isValid={isNextValid}
          setIsValid={setIsNextValid}
          options={filter.map(o => o.address)} 
          disabled={disableInput} />
      </div>
      <Button onClick={onClick} theme={buttonTheme} disabled={disableButton} className="py-6">Set</Button>
    </div>
  </div>
}
