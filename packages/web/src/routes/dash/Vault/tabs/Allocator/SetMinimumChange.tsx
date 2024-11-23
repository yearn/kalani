import { useVaultParams } from '../../../../../hooks/useVault'
import { useAllocator, useMinimumChange } from '../../useAllocator'
import { parseAbi } from 'viem'
import { useSimulateContract, UseSimulateContractParameters } from 'wagmi'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { useWaitForTransactionReceipt } from 'wagmi'
import { useMemo, useState, useCallback, useEffect } from 'react'
import InputInteger from '../../../../../components/elements/InputInteger'
import Button from '../../../../../components/elements/Button'

export function useSetMinimumChange(minimumChange: bigint) {
  const { address: vault } = useVaultParams()
  const { allocator } = useAllocator()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function setMinimumChange(address _vault, uint256 _minimumChange) external']),
    address: allocator,
    functionName: 'setMinimumChange',
    args: [vault, minimumChange],
    query: { enabled: !!vault }
  }), [vault, minimumChange])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export function SetMinimumChange() {
  const [minimumChange, setMinimumChange] = useState(0n)
  const { simulation, write, confirmation, resolveToast } = useSetMinimumChange(minimumChange)
  const dirty = useMemo(() => minimumChange !== 0n, [minimumChange])
  const { refetch: refetchMinimumChange } = useMinimumChange()

  const disabled = useMemo(() => {
    return !dirty
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [dirty, simulation, write, confirmation])

  const buttonTheme = useMemo(() => {
    if (!dirty) return 'default'
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      refetchMinimumChange()
    }
  }, [confirmation, resolveToast, refetchMinimumChange])

  const onSet = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <div className={`py-16 flex items-center justify-center`}>
    <div className="flex flex-col gap-8">
      <div className="text-xl">Set your vault's minimum change</div>
      <div className="flex items-center gap-6">
        <InputInteger value={Number(minimumChange)} onChange={e => setMinimumChange(BigInt(e.target.value))} isValid={true} />
        <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="h-14">Set</Button>
      </div>
    </div>
  </div>
}
