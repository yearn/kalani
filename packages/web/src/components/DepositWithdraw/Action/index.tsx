import { Suspense, useCallback, useMemo } from 'react'
import { useSuspendedDepositParameters } from '../useDepositParameters'
import { useApprove as useApprove } from './useApprove'
import { SkeletonButton } from '../../Skeleton'
import WriteContractButton from './WriteContractButton'
import { useBalance } from '../../../hooks/useBalance'
import { parseUnits } from 'viem'
import { useDeposit } from './useDeposit'
import { useAccount } from 'wagmi'
import Connect from '../../Connect'
import CTA from '../../CTA'
import { useVaultAsset } from '../useVaultAsset'
import { useVaultBalance } from '../useVaultBalance'

function Suspender() {
  const { chainId, vault, amount, setAmount, wallet } = useSuspendedDepositParameters()
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

export default function Action() {
  const { isConnected } = useAccount()

  if (!isConnected) return <div className="flex items-center justify-end">
    <Connect label={<CTA>Connect</CTA>} />
  </div>

  return <div className="flex items-center justify-end">
    <Suspense fallback={<SkeletonButton>Approve XYZI</SkeletonButton>}>
      <Suspender />
    </Suspense>
  </div>
}
