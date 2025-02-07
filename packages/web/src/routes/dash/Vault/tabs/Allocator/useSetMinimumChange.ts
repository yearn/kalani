import { useMemo } from 'react'
import { useVaultParams } from '../../../../../hooks/useVault'
import { useAllocator } from '../../useAllocator'
import { parseAbi } from 'viem'
import { useSimulateContract, UseSimulateContractParameters } from 'wagmi'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { useWaitForTransactionReceipt } from 'wagmi'

export function useSetMinimumChange(minimumChange: bigint | undefined) {
  const { address: vault } = useVaultParams()
  const { allocator } = useAllocator()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function setMinimumChange(address _vault, uint256 _minimumChange) external']),
    address: allocator,
    functionName: 'setMinimumChange',
    args: [vault, minimumChange ?? 0n],
    query: { enabled: !!vault && !!minimumChange }
  }), [vault, minimumChange, allocator])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}
