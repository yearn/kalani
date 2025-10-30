import { useMemo, useState, useCallback, useEffect } from 'react'
import Button from '../../../../../components/elements/Button'
import { cn } from '../../../../../lib/shadcn'
import { InputTokenAmount } from '../../../../../components/elements/InputTokenAmount'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { EvmAddress } from '@kalani/lib/types'
import { formatUnits, maxUint256, parseUnits, zeroAddress } from 'viem'
import { useSetMaxDebt } from './useSetMaxDebt'
import { useOnChainStrategyParams } from './useOnChainStrategyParams'

export function SetMaxDebt({ strategy, className }: { strategy: EvmAddress, className?: string }) {
  const { vault } = useVaultFromParams()
  const decimals = useMemo(() => vault?.asset.decimals ?? 18, [vault])

  const { strategyParams, refetch: refetchStrategyParams } = useOnChainStrategyParams(vault?.chainId ?? 0, vault?.address ?? zeroAddress, strategy)
  const onChainMaxDebt = useMemo(() => strategyParams?.maxDebt ?? 0n, [strategyParams])
  const [formattedMaxDebt, setFormattedMaxDebt] = useState<string | undefined>(formatUnits(onChainMaxDebt, decimals))
  const [maxDebt, setMaxDebt] = useState<bigint | undefined>(onChainMaxDebt)

  const { simulation, write, confirmation, resolveToast } = useSetMaxDebt(strategy, maxDebt)
  const dirty = useMemo(() => maxDebt !== onChainMaxDebt, [maxDebt, onChainMaxDebt])
  const authorizedDebtManager = useHasRolesOnChain(ROLES.DEBT_MANAGER)

  useEffect(() => {
    if (onChainMaxDebt === maxUint256) {
      setFormattedMaxDebt('MAX')
    } else {
      setFormattedMaxDebt(formatUnits(onChainMaxDebt, decimals))
    }
    setMaxDebt(onChainMaxDebt)
  }, [onChainMaxDebt, decimals])

  useEffect(() => {
    if (formattedMaxDebt === 'MAX') {
      setMaxDebt(maxUint256)
    } else {
      setMaxDebt(parseUnits(formattedMaxDebt ?? '0', decimals))
    }
  }, [formattedMaxDebt, decimals])

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
      refetchStrategyParams()
    }
  }, [confirmation, resolveToast, refetchStrategyParams])

  const onSet = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <div className={cn('flex items-center justify-center', className)}>
    <div className="flex items-center gap-4 sm:gap-6">
      <InputTokenAmount maxable symbol={vault?.asset.symbol ?? ''} amount={formattedMaxDebt} onChange={setFormattedMaxDebt} disabled={!authorizedDebtManager} className="w-56 sm:w-64" />
      <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="w-12">Set</Button>
    </div>
  </div>
}
