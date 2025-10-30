import { useMinimumChange } from '../../useAllocator'
import { useMemo, useState, useCallback, useEffect } from 'react'
import Button from '../../../../../components/elements/Button'
import { cn } from '../../../../../lib/shadcn'
import { useSetMinimumChange } from './useSetMinimumChange'
import { InputTokenAmount } from '../../../../../components/elements/InputTokenAmount'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { formatUnits, parseUnits } from 'viem'

export function SetMinimumChange({ className }: { className?: string }) {
  const { vault } = useVaultFromParams()
  const decimals = useMemo(() => vault?.asset.decimals ?? 18, [vault])
  const { minimumChange: onchainMinimumChange, refetch: refetchMinimumChange } = useMinimumChange()
  const [formattedMinimumChange, setFormattedMinimumChange] = useState<string | undefined>(formatUnits(onchainMinimumChange, decimals))
  const [minimumChange, setMinimumChange] = useState<bigint | undefined>(onchainMinimumChange)
  const { simulation, write, confirmation, resolveToast } = useSetMinimumChange(minimumChange)
  const dirty = useMemo(() => minimumChange !== onchainMinimumChange, [minimumChange, onchainMinimumChange])
  const authorizedDebtManager = useHasRolesOnChain(ROLES.DEBT_MANAGER)

  useEffect(() => {
    setFormattedMinimumChange(formatUnits(onchainMinimumChange, decimals))
    setMinimumChange(onchainMinimumChange)
  }, [onchainMinimumChange, decimals])

  useEffect(() => {
    setMinimumChange(parseUnits(formattedMinimumChange ?? '0', decimals))
  }, [formattedMinimumChange, decimals])

  const disabled = useMemo(() => {
    return !authorizedDebtManager
    || !dirty
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorizedDebtManager, dirty, simulation, write, confirmation])

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
      <InputTokenAmount symbol={vault?.asset.symbol ?? ''} amount={formattedMinimumChange} onChange={setFormattedMinimumChange} disabled={!authorizedDebtManager} />
      <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="w-12">Set</Button>
    </div>
  </div>
}
