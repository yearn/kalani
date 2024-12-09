import { zeroAddress } from 'viem'
import { useVaultFromParams } from '../../../../../hooks/useVault'
import { useMounted } from '../../../../../hooks/useMounted'
import FlyInFromBottom from "../../../../../components/motion/FlyInFromBottom"
import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractQueryOptions } from 'wagmi/query'
import { useAccount, useConfig } from 'wagmi'
import { fTokens } from '@kalani/lib/format'
import abis from '@kalani/lib/abis'
import { useMemo } from 'react'
import Button from '../../../../../components/elements/Button'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { AcceptFutureFeeManager } from './AcceptFutureFeeManager'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'

function AccumulatedFees() {
  const { address } = useAccount()
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()
  const config = useConfig()

  const isFeeRecipient = useMemo(() => compareEvmAddresses(address, accountant.feeRecipient), [address, accountant])

  const balanceQuery = useSuspenseQuery(
    readContractQueryOptions(config, {
      chainId: vault?.chainId ?? 0,
      address: vault?.address ?? zeroAddress,
      abi: abis.vault,
      functionName: 'balanceOf',
      args: [vault?.accountant ?? zeroAddress]
    })
  )

  const toAssetsQuery = useSuspenseQuery(
    readContractQueryOptions(config, {
      chainId: vault?.chainId ?? 0,
      address: vault?.address ?? zeroAddress,
      abi: abis.vault,
      functionName: 'convertToAssets',
      args: [balanceQuery.data ?? 0n]
    })
  )

  if (!vault) return <></>

  return <div className="flex flex-col gap-4">
    <div className="text-sm text-neutral-400">Claimable Fees</div>
    <div className="flex items-end justify-start gap-3">
      <div className="text-4xl">{fTokens(toAssetsQuery.data ?? 0n, vault.asset.decimals, { fixed: 4 })}</div>
      <div className="text-sm text-neutral-400">({vault.asset.symbol})</div>
    </div>
    {isFeeRecipient && <Button disabled={!toAssetsQuery.data} onClick={() => {}}>Claim</Button>}
  </div>
}

export default function Fees() {
  const mounted = useMounted()
  const { address } = useAccount()
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()

  const isFutureFeeManager = useMemo(() => compareEvmAddresses(address, accountant.futureFeeManager), [address, accountant])

  if (!vault) return <></>

  if (isFutureFeeManager) return <AcceptFutureFeeManager />

  return <FlyInFromBottom _key="aside-fees" parentMounted={mounted} exit={1} className="flex flex-col gap-12 w-full">
    <AccumulatedFees />
  </FlyInFromBottom>
}
