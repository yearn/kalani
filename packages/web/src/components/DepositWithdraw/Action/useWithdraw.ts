import { useParameters } from '../useParameters'
import { useConfig, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi, parseUnits } from 'viem'
import { useMemo } from 'react'
import { useWriteContract } from '../../../hooks/useWriteContract'
import { useVaultAsset } from '../useVaultAsset'

export function useWithdraw() {
  const config = useConfig()
  const { chainId, vault, amount, wallet } = useParameters()
  const { asset } = useVaultAsset(chainId!, vault!)

  const parameters = useMemo<UseSimulateContractParameters>(() => {
    if (!wallet || !vault || !asset || !Boolean(Number(amount))) {
      return { queryKey: ['useDeposit'], queryFn: async () => Promise.resolve() }
    }

    return {
      abi: parseAbi(['function withdraw(uint256, address, address)']),
      address: vault,
      functionName: 'withdraw',
      args: [parseUnits(amount, asset.decimals), wallet!, wallet!]
    }
  }, [config, asset, vault, amount])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  return {
    simulation, write, confirmation, resolveToast
  }
}
