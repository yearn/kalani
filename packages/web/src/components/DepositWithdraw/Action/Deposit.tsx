import { useCallback, useMemo } from 'react'
import { useSuspendedParameters } from '../useParameters'
import { useApprove as useApprove } from './useApprove'
import WriteContractButton from './WriteContractButton'
import { useBalance } from '../../../hooks/useBalance'
import { parseUnits } from 'viem'
import { useDeposit } from './useDeposit'
import { useVaultAsset } from '../useVaultAsset'
import { useVaultBalance } from '../useVaultBalance'

export default function Deposit() {
  const { chainId, vault, amount, setAmount, wallet } = useSuspendedParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  const { refetch: refetchVaultBalance } = useVaultBalance({ chainId: chainId!, vault: vault!, wallet: wallet! })
  const approve = useApprove()
  const deposit = useDeposit()

  const action = useMemo(() => {
    if (approve.needsApproval) return approve
    return deposit
  }, [approve, deposit])

  const { balance, decimals, refetch: refetchBalance } = useBalance({ chainId, token: asset.address, address: wallet! })

  const overflow = useMemo(() => (parseUnits(amount, decimals ?? 18) > (balance ?? 0n)), [amount, balance, decimals])

  const label = useMemo(() => {
    if (!Boolean(Number(amount))) return 'Enter an amount'
    return approve.needsApproval ? `Approve ${asset.symbol}` : `Deposit ${asset.symbol}`
  }, [amount, asset, approve.needsApproval])

  const disabled = useMemo(() => {
    if (!Boolean(Number(amount))) return true
    return overflow
  }, [amount, overflow])

  const error = useMemo(() => {
    if (overflow) return 'Insufficient balance'
  }, [overflow])

  const onConfirm = useCallback(() => {
    if (!approve.needsApproval) { setAmount('') }
    approve.allowanceQuery.refetch()
    approve.write.reset()
    deposit.write.reset()
    refetchBalance()
    refetchVaultBalance()
  }, [approve, deposit, refetchBalance, setAmount, refetchVaultBalance])

  return <WriteContractButton {...action} label={label} disabled={disabled} error={error} onConfirm={onConfirm} />
}
