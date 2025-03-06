import { useCallback, useMemo } from 'react'
import { useSuspendedParameters } from '../useParameters'
import WriteContractButton from './WriteContractButton'
import { parseUnits } from 'viem'
import { useWithdraw } from './useWithdraw'
import { useVaultAsset } from '../useVaultAsset'
import { useVaultBalance } from '../useVaultBalance'
import { useBalance } from '../../../hooks/useBalance'

export default function Withdraw() {
  const { chainId, vault, amount, setAmount, wallet } = useSuspendedParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  const { refetch: refetchWalletBalance } = useBalance({ chainId, token: asset.address, address: wallet! })
  const withdraw = useWithdraw()

  const action = useMemo(() => {
    return withdraw
  }, [withdraw])

  const { assets: balance, decimals, refetch: refetchVaultBalance } = useVaultBalance({ chainId: chainId!, vault: vault!, wallet: wallet! })

  const overflow = useMemo(() => (parseUnits(amount, decimals ?? 18) > (balance ?? 0n)), [amount, balance, decimals])

  const label = useMemo(() => {
    if (!Number(amount)) return 'Enter an amount'
    return `Withdraw ${asset.symbol}`
  }, [amount, asset])

  const disabled = useMemo(() => {
    if (!Number(amount)) return true
    return overflow
  }, [amount, overflow])

  const error = useMemo(() => {
    if (overflow) return 'Insufficient balance'
  }, [overflow])

  const onConfirm = useCallback(() => {
    setAmount('')
    withdraw.write.reset()
    refetchVaultBalance()
    refetchWalletBalance()
  }, [withdraw, refetchVaultBalance, setAmount, refetchWalletBalance])

  return <WriteContractButton {...action} label={label} amountZero={!Number(amount)} disabled={disabled} error={error} onConfirm={onConfirm} />
}
