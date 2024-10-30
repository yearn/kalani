import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useMemo } from 'react'
import { parseAbi } from 'viem'
import { useWriteContract } from '../../../hooks/useWriteContract'
import { useVaultFormData, useVaultFormValidation } from './useVaultForm'
import { zeroAddress } from 'viem'
import { useSelectedProject } from '../../../components/SelectProject'

export function useNewVault() {
  const { selectedProject } = useSelectedProject()

  const { asset, category, name, symbol, newAddress } = useVaultFormData()
  const { isFormValid } = useVaultFormValidation()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function newVault(address _asset, uint256 _category, string calldata _name, string calldata _symbol)']), 
    address: selectedProject?.roleManager ?? zeroAddress,
    functionName: 'newVault',
    args: [asset?.address ?? zeroAddress, category, name, symbol],
    query: { enabled: isFormValid && !newAddress }
  }), [isFormValid, asset, category, name, symbol, newAddress])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}
