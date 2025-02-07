import { useMinimumChange } from '../../useAllocator'
import { useMemo, useState, useCallback, useEffect } from 'react'
import Button from '../../../../../components/elements/Button'
import { cn } from '../../../../../lib/shadcn'
import { useSetMinimumChange } from './useSetMinimumChange'
import { InputTokenAmount } from '../../../../../components/elements/InputTokenAmount'
import { useVaultFromParams } from '../../../../../hooks/useVault'

export function SetMinimumChange({ className }: { className?: string }) {
  const { vault } = useVaultFromParams()
  const { minimumChange: onchainMinimumChange, refetch: refetchMinimumChange } = useMinimumChange()
  const [minimumChange, setMinimumChange] = useState<bigint | undefined>(onchainMinimumChange)
  const { simulation, write, confirmation, resolveToast } = useSetMinimumChange(minimumChange)
  const dirty = useMemo(() => minimumChange !== onchainMinimumChange, [minimumChange, onchainMinimumChange])

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
  }, [simulation, write, confirmation, dirty])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError, simulation.error])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      refetchMinimumChange()
    }
  }, [confirmation, resolveToast, refetchMinimumChange])

  const onSet = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <div className={cn('flex items-center justify-center', className)}>
    <div className="flex items-center gap-6">
      <InputTokenAmount symbol={vault?.asset.symbol ?? ''} decimals={vault?.asset.decimals ?? 0} amount={minimumChange} onChange={setMinimumChange} />
      <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="w-12">Set</Button>
    </div>
  </div>
}
