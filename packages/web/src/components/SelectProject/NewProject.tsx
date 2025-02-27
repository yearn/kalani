import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../elements/Input'
import Button from '../elements/Button'
import { useDialog } from '../../components/Dialog/useDialog'
import Address from '../elements/Address'
import { ROLE_MANAGER_FACTORY } from '@kalani/lib/addresses'
import { useAccount, useReadContract, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { zeroAddress } from 'viem'
import { getAddress } from 'viem'
import { useWriteContract } from '../../hooks/useWriteContract'
import abis from '@kalani/lib/abis'
import FlyInFromBottom from '../motion/FlyInFromBottom'
import { cn } from '../../lib/shadcn'
import { isNothing } from '@kalani/lib/strings'
import { fHexString } from '@kalani/lib/format'
import { useLocalProjects, useReadProject } from './useProjects'
import { useSelectedProject } from './useSelectedProject'
import { useNavigate } from 'react-router-dom'
import Skeleton from '../Skeleton'

function useWrite(
  chainId: number,
  name: string,
  governance: string | undefined, 
  management: string | undefined,
  enabled: boolean
) {
  const getAddressOrZero = useCallback((address: string | undefined) => {
    if (isNothing(address)) return zeroAddress
    try { return enabled ? getAddress(address!) : zeroAddress }
    catch { return zeroAddress }
  }, [enabled])

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.roleManagerFactory,
    chainId: chainId,
    address: ROLE_MANAGER_FACTORY,
    args: [
      name, 
      getAddressOrZero(governance), 
      getAddressOrZero(management)
    ],
    functionName: 'newProject',
    query: { enabled }
  }), [chainId, name, governance, management, enabled])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function useProjectId(name: string, governance: string | undefined, enabled?: boolean) {
  const { chainId } = useAccount()
  return useReadContract({
    abi: abis.roleManagerFactory,
    chainId: chainId,
    address: ROLE_MANAGER_FACTORY,
    functionName: 'getProjectId',
    args: [name, getAddress(enabled ? governance ?? zeroAddress : zeroAddress)],
    query: { enabled }
  })
}

function Suspender({ dialogId }: { dialogId: string }) {
  const { chainId, address, isConnected } = useAccount()
  const [name, setName] = useState('')
  const [governance, setGovernance] = useState<string | undefined>()
  const [isGovernanceValid, setIsGovernanceValid] = useState(false)
  const [management, setManagement] = useState<string | undefined>()
  const [isManagementValid, setIsManagementValid] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const { closeDialog } = useDialog(dialogId)
  const { data: projectId } = useProjectId(name, governance, isGovernanceValid)
  const { simulation, write, confirmation, resolveToast } = useWrite(
    chainId ?? 1, name, governance, management, isFormValid
  )

  const areSameAddress = useMemo(() => {
    return governance && management && governance === management
  }, [governance, management])

  useEffect(() => {
    if (address) { setGovernance(address) }
  }, [address])

  useEffect(() => {
    setIsFormValid(
      name.length > 2 
      && isGovernanceValid 
      && (isNothing(management) || isManagementValid)
      && !areSameAddress
    )
  }, [name, isGovernanceValid, management, isManagementValid, areSameAddress])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !isFormValid
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [isFormValid, simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

  const onCreate = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) { 
      resolveToast()
    }
  }, [confirmation, resolveToast])

  const { setLocalProjects } = useLocalProjects()
  const { setSelectedProject } = useSelectedProject()
  const { project } = useReadProject(chainId!, projectId, confirmation.isSuccess)
  const navigate = useNavigate()

  const onOk = useCallback(async () => {
    await setLocalProjects(projects => ([...(projects ?? []), project]))
    setSelectedProject(project)
    navigate('/build', { replace: true })
  }, [setLocalProjects, setSelectedProject, project, navigate])

  return <div className="relative flex flex-col gap-6">
    {!confirmation.isSuccess && <div className={cn('flex flex-col gap-6')}>
      <Input disabled={!isConnected} className="theme-sim" value={name} onChange={e => setName(e.target.value)} placeholder="Project name" maxLength={128} />
      <Address infokey="new-project-governance" disabled={!isConnected} placeholder="0x governance (required)" next={governance} setNext={setGovernance} isNextValid={isGovernanceValid} setIsNextValid={setIsGovernanceValid} />
      <Address infokey="new-project-management" disabled={!isConnected} placeholder="0x management (recommended)" next={management} setNext={setManagement} isNextValid={isManagementValid} setIsNextValid={setIsManagementValid} theme={areSameAddress ? 'error' : 'default'} />
      <div className="mt-8 flex items-center justify-end gap-3">
        <Button h="secondary" onClick={closeDialog}>Cancel</Button>
        <Button disabled={disabled} theme={buttonTheme} onClick={onCreate}>Create project</Button>
      </div>
    </div>}

    {confirmation.isSuccess && <FlyInFromBottom _key="ready" className="flex flex-col gap-6">
      <div className={cn('grow rounded-primary flex flex-col gap-2 p-4 text-lg')}>
        <div>Id: {fHexString(projectId ?? '0x')}</div>
        <div>Name: {name}</div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button className="w-full" onClick={onOk}>Project ready, OK!</Button>
      </div>
    </FlyInFromBottom>}
  </div>
}

export default function NewProject({ dialogId }: { dialogId: string }) {
  return <Suspense fallback={<Skeleton className="w-full h-48 rounded-primary" />}>
    <Suspender dialogId={dialogId} />
  </Suspense>
}
