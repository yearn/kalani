import abis from '@/lib/abis'
import { motion } from 'framer-motion'
import { springs } from '@/lib/motion'
import { EvmAddress, ROLES, enumerateEnum } from '@/lib/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UseSimulateContractParameters, UseWaitForTransactionReceiptReturnType, UseWriteContractReturnType, useAccount, useReadContract, useReadContracts, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
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
import { useIsRoleManager, useRoleManager } from '@/hooks/useRoleManager'
import { zeroAddress } from 'viem'
import Link from '@/components/elements/Link'

function usePrevious({ 
  vault, account 
}: { 
  vault: EvmAddress, account?: EvmAddress 
}) {
  const { data: roleMask, refetch } = useReadContract({
    address: vault, abi: abis.vault, functionName: 'roles', args: [account ?? zeroAddress],
    query: { enabled: !!account }
  })

  const roles = useMemo(() => {
    const result: {
      [key: string]: boolean
    } = {}

    for (const role of enumerateEnum(ROLES)) {
      const mask = BigInt(ROLES[role as keyof typeof ROLES])
      result[role] = ((roleMask || 0n) & mask) === mask
    }

    return result
  }, [roleMask])

  return { roles, refetch }
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
  vault, account, editAddress, className
}: { 
  vault: EvmAddress, 
  account?: EvmAddress,
  editAddress?: boolean,
  className?: string 
}) {
  const mounted = useMounted()
  const _isRoleManager = useIsRoleManager(vault)
  const { roles: previous, refetch } = usePrevious({ vault, account })
  const [next, setNext] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string | undefined>(undefined)

  const changed = useMemo(() => JSON.stringify(previous) !== JSON.stringify(next), [previous, next])
  const rolemask = useMemo(() => Object.keys(next).reduce((acc, role) => next[role] ? acc + BigInt(ROLES[role as keyof typeof ROLES]) : acc, 0n), [next])
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
  } = useWrite({ 
    vault, 
    account: account ?? zeroAddress, 
    rolemask, 
    enabled: (_isRoleManager ?? false) && !!account && changed 
  })

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

  const disableReset = useMemo(() => !(_isRoleManager && changed), [_isRoleManager, changed])
  const disableGesture = useMemo(() => !_isRoleManager, [_isRoleManager])

  const disableSave = useMemo(() => 
    ! account
    || !_isRoleManager
    || !changed
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [account, _isRoleManager, changed, simulation, write, confirmation])

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

  const roleManager = useRoleManager(vault)
  const isRoleManager = useCallback((address: EvmAddress) => {
    return roleManager === address
  }, [roleManager])

  return <Accordion type="single" className={className} collapsible>
    <AccordionItem value="item-1" className="flex flex-col gap-4">
      <AccordionTrigger>
        <div className="flex items-center gap-8">
          <div>{fEvmAddress(account ?? zeroAddress)}</div>
          <div>{isRoleManager(account ?? zeroAddress) ? <PiStarFill className="fill-primary-300" /> : <PiStar className="fill-neutral-900" />}</div>
          <div className="flex items-cemter gap-2">
            {Object.keys(next).map((role, i) => 
              <Dot key={i} role={role} checked={next[role]} />
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-8">
        {!editAddress && <div className="text-neutral-400">
          <Link href={`/account/${account ?? zeroAddress}`}>{account ?? zeroAddress}</Link>
        </div>}

        {editAddress && <InputAddressProvider><InputAddress /></InputAddressProvider>}

        <div className="flex flex-wrap items-center gap-4">
          {Object.keys(next).map((role, i) => 
            <Toggle key={i} role={role} checked={next[role]} disabled={!_isRoleManager} onClick={() => toggle(role)} />
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
