import { useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../elements/Input'
import Button from '../elements/Button'
import { useDialog } from '../Dialog'
import Address from '../elements/Address'
import { ROLE_MANAGER_FACTORY } from '@kalani/lib/addresses'
import { useAccount, useReadContract, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { parseEventLogs, zeroAddress } from 'viem'
import { getAddress } from 'viem'
import { useWriteContract } from '../../hooks/useWriteContract'
import abis from '@kalani/lib/abis'
import FlyInFromBottom from '../motion/FlyInFromBottom'
import { cn } from '../../lib/shadcn'
import IndexProject from './IndexProject'
import { useIndexProject } from './useIndexProject'

function useWrite(
  chainId: number,
  name: string,
  governance: string | undefined, 
  management: string | undefined,
  enabled: boolean
) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.roleManagerFactory,
    chainId: chainId,
    address: ROLE_MANAGER_FACTORY,
    args: [name, getAddress(governance ?? zeroAddress), getAddress(management ?? zeroAddress)],
    functionName: 'newProject',
    query: { enabled }
  }), [chainId, name, governance, management, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function useProjectId(name: string, governance: string | undefined) {
  const { chainId } = useAccount()
  return useReadContract({
    abi: abis.roleManagerFactory,
    chainId: chainId,
    address: ROLE_MANAGER_FACTORY,
    functionName: 'getProjectId',
    args: [name, getAddress(governance ?? zeroAddress)],
    query: { enabled: !!governance }
  })
}

export default function NewProject({ dialogId }: { dialogId: string }) {
  const { chainId, address } = useAccount()
  const [name, setName] = useState('')
  const [governance, setGovernance] = useState<string | undefined>()
  const [isGovernanceValid, setIsGovernanceValid] = useState(false)
  const [management, setManagement] = useState<string | undefined>()
  const [isManagementValid, setIsManagementValid] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const { closeDialog } = useDialog(dialogId)
  const { data: projectId } = useProjectId(name, governance)
  const { simulation, write, confirmation, resolveToast } = useWrite(
    chainId ?? 1, name, governance, management, isFormValid
  )
  const indexProject = useIndexProject(chainId, projectId)

  useEffect(() => {
    if (address) { setGovernance(address) }
  }, [address])

  useEffect(() => {
    setIsFormValid(name.length > 2 && isGovernanceValid && ((management ?? '').length === 0  || isManagementValid))
  }, [name, isGovernanceValid, management, isManagementValid])

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
      if (indexProject.mutation.isIdle) {
        const logs = parseEventLogs({ 
          abi: abis.roleManagerFactory, 
          eventName: 'NewProject', 
          logs: confirmation.data.logs 
        })
        const { roleManager } = logs[0].args
        const approximateBlockTime = Math.floor(Date.now() / 1000)
        indexProject.mutation.mutate({ 
          roleManager, 
          inceptBlock: confirmation.data.blockNumber, 
          inceptTime: approximateBlockTime 
        })
      }
    }
  }, [confirmation, resolveToast, indexProject])

  return <div className="relative flex flex-col gap-6">
    <div className={cn('flex flex-col gap-6', confirmation.isSuccess && 'invisible')}>
      <Input className="theme-sim" value={name} onChange={e => setName(e.target.value)} placeholder="Project name" maxLength={128} />
      <Address frozen placeholder="0x governance" next={governance} setNext={setGovernance} isNextValid={isGovernanceValid} setIsNextValid={setIsGovernanceValid} />
      <Address placeholder="0x management (optional)" next={management} setNext={setManagement} isNextValid={isManagementValid} setIsNextValid={setIsManagementValid} />
      <div className="flex items-center justify-end gap-3">
        <Button h="secondary" onClick={closeDialog}>Cancel</Button>
        <Button disabled={disabled} theme={buttonTheme} onClick={onCreate}>Create</Button>
      </div>
    </div>

    {confirmation.isSuccess && <FlyInFromBottom _key="indexing" className="absolute inset-0 flex flex-col gap-6">
      <IndexProject chainId={chainId} projectId={projectId} name={name} governance={governance} dialogId={dialogId} />
    </FlyInFromBottom>}
  </div>
}
