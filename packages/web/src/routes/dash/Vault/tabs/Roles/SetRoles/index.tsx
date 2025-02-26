import abis from '@kalani/lib/abis'
import { EvmAddress, EvmAddressSchema, ROLES, enumerateEnum } from '@kalani/lib/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UseSimulateContractParameters, useReadContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import Toggle from './Toggle'
import Button from '../../../../../../components/elements/Button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../../../components/shadcn/accordion'
import { fEvmAddress } from '@kalani/lib/format'
import { PiStar, PiStarFill } from 'react-icons/pi'
import Address from '../../../../../../components/elements/Address'
import { useIsRoleManager, useRoleManager } from '../../../../../../hooks/useRoleManager'
import { zeroAddress } from 'viem'
import { useWriteContract } from '../../../../../../hooks/useWriteContract'
import Sticker from '../../../../../../components/elements/Sticker'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { roleClassNames } from './roleClassNames'

function usePrevious({
  chainId, vault, account 
}: { 
  chainId: number, vault: EvmAddress, account?: EvmAddress 
}) {
  const { data: roleMask, refetch } = useReadContract({
    chainId, address: vault, abi: abis.vault, functionName: 'roles', args: [account ?? zeroAddress],
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
  chainId, vault, account, rolemask, enabled 
}: { 
  chainId: number,
  vault: EvmAddress,
  account: EvmAddress,
  rolemask: bigint,
  enabled: boolean
}) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    chainId,
    address: vault,
    abi: abis.vault,
    functionName: 'set_role',
    args: [account, rolemask],
    query: { enabled }
  }), [chainId, vault, account, rolemask, enabled])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function Role({ role, granted }: { role: keyof typeof ROLES, granted: boolean }) {
  const roleClassName = roleClassNames[role as keyof typeof roleClassNames] ?? {}
  const checkedClassName = `${roleClassName.checked} group-active:text-inherit`
  return <div className={`
    text-xs ${roleClassName.defaults} ${granted ? checkedClassName : roleClassName.unchecked}
    whitespace-nowrap pointer-events-none`}>
    {role.replace('_MANAGER', '').replace('_', ' ')}
  </div>
}

export default function SetRoles({
  chainId, vault, account, editAddress, className
}: { 
  chainId: number,
  vault: EvmAddress, 
  account?: EvmAddress,
  editAddress?: boolean,
  className?: string 
}) {
  const _isRoleManager = useIsRoleManager({ chainId, address: vault })
  const { roles: previous, refetch } = usePrevious({ chainId, vault, account })
  const [next, setNext] = useState<{ [key: string]: boolean }>({})
  const [newAccount, setNewAccount] = useState<string | undefined>(undefined)
  const [isNewAccountValid, setIsNewAccountValid] = useState<boolean>(false)

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
    simulation, write, confirmation, resolveToast
  } = useWrite({ 
    chainId,
    vault, 
    account: account ?? (isNewAccountValid ? EvmAddressSchema.parse(newAccount) : zeroAddress), 
    rolemask, 
    enabled: (_isRoleManager ?? false) && ((!!account && changed) || isNewAccountValid) 
  })

  useEffect(() => setNext(previous), [previous])

  useEffect(() => {
    if (simulation.isError) {
      console.error(simulation.error.message)
    }
  }, [simulation])
 
  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      refetch()
    }
  }, [confirmation, resolveToast, refetch])

  const disableReset = useMemo(() => !(_isRoleManager && changed), [_isRoleManager, changed])
  const disableGesture = useMemo(() => !_isRoleManager, [_isRoleManager])

  const disableSave = useMemo(() => 
    ! (account || newAccount)
    || !_isRoleManager
    || !(changed || isNewAccountValid)
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [account, _isRoleManager, changed, isNewAccountValid, simulation, write, confirmation, newAccount])

  const saveTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const save = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  const roleManager = useRoleManager({ chainId, address: vault })
  const isRoleManager = useMemo(() => {
    return compareEvmAddresses(roleManager, account ?? zeroAddress)
  }, [roleManager, account])

  const isRoleManagerClassName = useMemo(() => isRoleManager ? 'text-yellow-400' : 'text-neutral-600', [isRoleManager])

  return <Accordion type="single" className={className} collapsible>
    <AccordionItem value="item-1" className="flex flex-col gap-4">
      <AccordionTrigger>
        <div className="flex items-start sm:items-center flex-col sm:flex-row gap-8">

          <div>{fEvmAddress(account ?? zeroAddress)}</div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className={isRoleManagerClassName}>
              {isRoleManager ? <PiStarFill size={12} /> : <PiStar size={12} />}
            </div>
            <div className={isRoleManagerClassName}>ROLE MANAGER</div>
            {Object.keys(next).map(role => <div key={role} className="flex items-center gap-2">
              <div className="text-xs text-neutral-600">//</div>
              <Role role={role as keyof typeof ROLES} granted={next[role]} />
            </div>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-8">
        {!editAddress && <div>
          <Sticker to={`/account/${account ?? zeroAddress}`}>{account ?? zeroAddress}</Sticker>
        </div>}

        {editAddress && <Address 
          previous={undefined}
          next={newAccount}
          setNext={setNewAccount}
          isNextValid={isNewAccountValid}
          setIsNextValid={setIsNewAccountValid} />}

        <div className="flex flex-wrap items-center gap-4">
          {Object.keys(next).map((role, i) => 
            <Toggle key={i} role={role} checked={next[role]} disabled={!_isRoleManager} onClick={() => toggle(role)} />
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          <Button disabled={disableReset} onClick={reset} h={'secondary'}>Reset</Button>
          <Button disabled={disableGesture} onClick={gesture}  h={'secondary'} className="w-32">{gestureLabel}</Button>
          <Button disabled={disableSave} theme={saveTheme} onClick={save}>Save</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
}
