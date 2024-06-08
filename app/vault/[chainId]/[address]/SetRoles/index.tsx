import abis from '@/lib/abis'
import { motion } from 'framer-motion'
import { springs } from '@/lib/motion'
import { EvmAddress, ROLES, enumerateEnum } from '@/lib/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UseSimulateContractParameters, UseWaitForTransactionReceiptReturnType, UseWriteContractReturnType, useAccount, useReadContracts, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import Toggle from './Toggle'
import Button from '@/components/elements/Button'
import { useMounted } from '@/hooks/useMounted'
import ExploreHash from '@/components/ExploreHash'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../../components/shadcn/accordion'
import { fEvmAddress } from '@/lib/format'
import Dot from './Dot'
import { PiStar, PiStarFill } from 'react-icons/pi'
import InputAddress from '@/components/InputAddress'
import { InputAddressProvider } from '@/components/InputAddress/provider'

function usePrevious({ vault, account }: { vault: EvmAddress, account: EvmAddress }) {
  const multicall = useReadContracts({ contracts: [
    { address: vault, abi: abis.vault, functionName: 'roles', args: [account] }, 
    { address: vault, abi: abis.vault, functionName: 'role_manager' }
  ] })

  const permittedRolesMask = useMemo(() => multicall.data?.[0]?.result ?? 0n, [multicall])
  const roleManager = useMemo(() => multicall.data?.[1]?.result, [multicall])

  const roles = useMemo(() => {
    const result: {
      [key: string]: boolean
    } = {}

    for (const role of enumerateEnum(ROLES)) {
      const rolemask = BigInt(ROLES[role as keyof typeof ROLES])
      result[role] = ((permittedRolesMask || 0n) & rolemask) === rolemask
    }

    return result
  }, [permittedRolesMask])

  return { roles, roleManager, refetch: multicall.refetch }
}

function useWrite({ 
  vault, account, rolemask, enabled 
}: { 
  vault: EvmAddress,
  account: EvmAddress,
  rolemask: bigint,
  enabled: boolean
}) {

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    address: vault,
    abi: abis.vault,
    functionName: 'set_role',
    args: [account, rolemask],
    query: { enabled }
  }), [vault, account, rolemask, enabled])

  const simulation = useSimulateContract(parameters)
  const write = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation }
}

function useSubtext({
  write,
  confirmation,
  error
}: {
  write: UseWriteContractReturnType,
  confirmation: UseWaitForTransactionReceiptReturnType,
  error?: string
}) {
  return useMemo(() => {
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

    return {
      key: 'default',
      text: <>&nbsp;</>
    }
  }, [error, confirmation, write])
}

export default function SetRoles({
  vault, account, isRoleManager, editAddress, className
}: { 
  vault: EvmAddress, 
  account: EvmAddress, 
  isRoleManager: boolean,
  editAddress?: boolean,
  className?: string 
}) {

  const { isConnected, address } = useAccount()
  const mounted = useMounted()
  const { roles: previous, roleManager, refetch } = usePrevious({ vault, account })
  const [next, setNext] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string | undefined>(undefined)

  const changed = useMemo(() => JSON.stringify(previous) !== JSON.stringify(next), [previous, next])
  const rolemask = useMemo(() => Object.keys(next).reduce((acc, role) => next[role] ? acc + BigInt(ROLES[role as keyof typeof ROLES]) : acc, 0n), [next])
  const permitted = useMemo(() => isConnected && address === roleManager, [isConnected, address, roleManager])
  const gestureLabel = useMemo(() => Object.values(next).some(value => value) ? 'Clear' : 'All', [next])

  const reset = useCallback(() => setNext(previous), [setNext, previous])
  const gesture = useCallback(() => {
    const some = Object.values(next).some(value => value)
    setNext(Object.fromEntries(Object.keys(next).map(role => [role, !some])))
  }, [next, setNext])
  const toggle = useCallback((role: string) => {
    setNext(prev => ({ ...prev, [role]: !prev[role] }))
  }, [])

  const {
    simulation, write, confirmation 
  } = useWrite({ vault, account, rolemask, enabled: permitted && changed })

  useEffect(() => setNext(previous), [previous])

  useEffect(() => {
    if (simulation.isError) {
      setError(`This will revert, see console for details.`)
      console.error(simulation.error.message)
    }
  }, [simulation, setError])
 
  useEffect(() => {
    if (confirmation.isSuccess) refetch()
  }, [confirmation, refetch])

  const disableReset = useMemo(() => !(permitted && changed), [permitted, changed])
  const disableGesture = useMemo(() => !permitted, [permitted])

  const disableSave = useMemo(() => 
    !permitted
    || !changed
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [permitted, changed, simulation, write, confirmation])

  const saveTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const save = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  const subtext = useSubtext({ write, confirmation, error })

  return <Accordion type="single" className={className} collapsible>
    <AccordionItem value="item-1" className="flex flex-col gap-4">
      <AccordionTrigger>
        <div className="flex items-center gap-6">
          <div>{fEvmAddress(account)}</div>
          <div>{isRoleManager ? <PiStarFill className="fill-primary-300" /> : <PiStar className="fill-neutral-900" />}</div>
          <div className="flex items-cemter gap-2">
            {Object.keys(next).map((role, i) => 
              <Dot key={i} role={role} checked={next[role]} />
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-8">
        {editAddress && <div className="text-neutral-400">{account}</div>}
        {!editAddress && <InputAddressProvider><InputAddress /></InputAddressProvider>}

        <div className="flex flex-wrap items-center gap-4">
          {Object.keys(next).map((role, i) => 
            <Toggle key={i} role={role} checked={next[role]} disabled={!permitted} onClick={() => toggle(role)} />
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          <Button disabled={disableReset} onClick={reset}>Reset</Button>
          <Button disabled={disableGesture} onClick={gesture} className="w-32">{gestureLabel}</Button>
          <Button disabled={disableSave} theme={saveTheme} onClick={save}>Save</Button>
        </div>
        <div className={`pl-3 flex justify-end text-xs text-neutral-400`}>
          <motion.div key={subtext.key}
            transition={springs.roll}
            initial={mounted ? { x: 40, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}>
            {subtext.text}
          </motion.div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
}
