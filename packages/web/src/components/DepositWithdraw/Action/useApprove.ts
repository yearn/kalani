import { useDepositParameters } from '../useDepositParameters'
import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractQueryOptions } from 'wagmi/query'
import { useConfig, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi, maxUint256, parseUnits, zeroAddress } from 'viem'
import { useEffect, useMemo } from 'react'
import { useWriteContract } from '../../../hooks/useWriteContract'
import { useVaultAsset } from '../useVaultAsset'

export function useApprove() {
  const config = useConfig()
  const { chainId, vault, amount, wallet } = useDepositParameters()
  const { asset } = useVaultAsset(chainId!, vault!)

  const allowanceOptions = useMemo(() => {
    if (!wallet || !vault || !asset) {
      return { queryKey: ['useApprove'], queryFn: async () => Promise.resolve(0n) }
    }

    return readContractQueryOptions(config, {
      abi: erc20Abi,
      address: asset.address,
      functionName: 'allowance',
      args: [wallet, vault]
    })
  }, [config, vault, asset, wallet])

  const allowanceQuery = useSuspenseQuery(allowanceOptions)

  useEffect(() => {
    allowanceQuery.refetch()
  }, [amount, allowanceQuery])

  const needsApproval = useMemo(() => {
    const amountb = parseUnits(amount, asset?.decimals ?? 18)
    const allowance = allowanceQuery.data ?? 0n
    return allowance < amountb
  }, [allowanceQuery, amount, asset])

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: erc20Abi,
    address: asset?.address ?? zeroAddress,
    functionName: 'approve',
    args: [vault ?? zeroAddress, maxUint256]
  }), [asset, vault])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  return {
    allowanceQuery, needsApproval, simulation, write, confirmation, resolveToast
  }
}
