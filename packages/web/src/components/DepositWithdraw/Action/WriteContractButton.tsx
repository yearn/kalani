import { useCallback, useEffect, useMemo } from 'react'
import Button from '../../elements/Button'
import { UseSimulateContractReturnType, UseWaitForTransactionReceiptReturnType, UseWriteContractReturnType } from 'wagmi'
import { isSomething } from '@kalani/lib/strings'

export default function WriteContractButton({ 
  write, 
  confirmation, 
  simulation,
  label,
  onClick,
  disabled,
  error,
  resolveToast,
  onConfirm
}: {
  write: UseWriteContractReturnType
  confirmation: UseWaitForTransactionReceiptReturnType
  simulation: UseSimulateContractReturnType
  label: string
  onClick?: () => void
  disabled?: boolean
  error?: string
  resolveToast?: () => void
  onConfirm?: () => void
}) {

  const _disabled = useMemo(() => {
    return isSomething(error) || disabled
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [error, disabled, simulation, write, confirmation])

  const buttonTheme = useMemo(() => {
    if (isSomething(error)) return 'error'
    if (disabled) return 'default'
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [error, disabled, simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

  const _onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
    onClick?.()
  }, [onClick, write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) { 
      resolveToast?.()
      onConfirm?.()
    }
  }, [confirmation, resolveToast, onConfirm])

  return <Button onClick={_onClick} theme={buttonTheme} disabled={_disabled}>{error ?? label}</Button>
}
