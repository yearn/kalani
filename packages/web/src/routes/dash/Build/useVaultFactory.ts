import { useAccount, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useMemo } from 'react'
import abis from '@kalani/lib/abis'
import { VAULT_FACTORY } from '@kalani/lib/addresses'
import { useWriteContract } from '../../../hooks/useWriteContract'
import { useVaultFormData, useVaultFormValidation } from './useVaultForm'
import { zeroAddress } from 'viem'

export function useVaultFactory() {
  const { address } = useAccount()
  const { asset, name, symbol, profitMaxUnlockTime } = useVaultFormData()
  const { isFormValid } = useVaultFormValidation()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.vaultFactory, address: VAULT_FACTORY,
    functionName: 'deploy_new_vault',
    args: [asset?.address ?? zeroAddress, name, symbol, address ?? zeroAddress, profitMaxUnlockTime],
    query: { enabled: address && isFormValid }
  }), [address, isFormValid, asset, name, symbol, profitMaxUnlockTime])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}
