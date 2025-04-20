import { parseAbi, zeroAddress } from 'viem'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractQueryOptions } from 'wagmi/query'
import { useConfig, useWaitForTransactionReceipt, useSimulateContract, UseSimulateContractParameters, useAccount } from 'wagmi'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import abis from '@kalani/lib/abis'
import { useMemo } from 'react'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import { compareEvmAddresses } from '@kalani/lib/strings'

export function useClaimable() {
  const { vault } = useVaultFromParams()
  const config = useConfig()
  return useSuspenseQuery(
    readContractQueryOptions(config, {
      chainId: vault?.chainId ?? 0,
      address: vault?.address ?? zeroAddress,
      abi: abis.vault,
      functionName: 'balanceOf',
      args: [vault?.accountant ?? zeroAddress]
    })
  )
}

export function useClaim() {
  const { address } = useAccount()
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()
  const isFeeRecipient = useMemo(() => compareEvmAddresses(address, accountant.feeRecipient), [address, accountant])
  const claimable = useClaimable()
  const enabled = useMemo(() => isFeeRecipient && claimable.data > 0n, [claimable, isFeeRecipient])
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function redeemUnderlying(address vault)']),
    address: vault?.accountant ?? zeroAddress,
    functionName: 'redeemUnderlying',
    args: [vault?.address ?? zeroAddress],
    query: { enabled }
  }), [vault, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}