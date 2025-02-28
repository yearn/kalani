import { zeroAddress } from 'viem'
import { useVaultParams } from '../../../../../hooks/useVault'
import { useMemo } from 'react'
import { useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { EvmAddress } from '@kalani/lib/types'
import { UseSimulateContractParameters } from 'wagmi'
import abis from '@kalani/lib/abis'
import { useWriteContract } from '../../../../../hooks/useWriteContract'

export function useAddStrategy(strategy: EvmAddress) {
  const { address: vault } = useVaultParams()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.vault,
    address: vault ?? zeroAddress,
    functionName: 'add_strategy',
    args: [strategy],
    query: { enabled: !!vault }
  }), [vault, strategy])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}
