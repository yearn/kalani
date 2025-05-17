import { useParameters } from '../useParameters'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi, parseUnits } from 'viem'
import { useMemo } from 'react'
import { useWriteContract } from '../../../hooks/useWriteContract'
import { useVaultAsset } from '../useVaultAsset'

const MAX_LOSS = 50n

export function useWithdraw() {
  const { chainId, vault, amount, wallet } = useParameters()
  const { asset } = useVaultAsset(chainId!, vault!)

  const parameters = useMemo<UseSimulateContractParameters>(() => {
    if (!wallet || !vault || !asset || !Number(amount)) {
      return { queryKey: ['useDeposit'], queryFn: async () => Promise.resolve() }
    }

    return {
      abi: parseAbi(['function withdraw(uint256, address, address, uint256)']),
      address: vault,
      functionName: 'withdraw',
      args: [parseUnits(amount, asset.decimals), wallet!, wallet!, MAX_LOSS]
    }
  }, [asset, vault, amount, wallet])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  return {
    simulation, write, confirmation, resolveToast
  }
}
