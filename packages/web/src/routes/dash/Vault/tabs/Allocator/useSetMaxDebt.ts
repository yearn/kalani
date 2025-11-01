import { useMemo } from 'react'
import { useVaultParams } from '../../../../../hooks/useVault'
import { parseAbi } from 'viem'
import { useSimulateContract, UseSimulateContractParameters } from 'wagmi'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { useWaitForTransactionReceipt } from 'wagmi'
import { EvmAddress } from '@kalani/lib/types'

export function useSetMaxDebt(strategy: EvmAddress, maxDebt: bigint | undefined) {
  const { address: vault } = useVaultParams()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function update_max_debt_for_strategy(address _strategy, uint256 _new_max_debt) external']),
    address: vault,
    functionName: 'update_max_debt_for_strategy',
    args: [strategy, maxDebt ?? 0n],
    query: { enabled: !!vault && !!strategy }
  }), [vault, strategy, maxDebt])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data, confirmations: 2 })
  return { simulation, write, confirmation, resolveToast }
}
