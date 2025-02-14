import Section from '../../../../components/Section'
import { Vault, withVault } from '../../../../hooks/useVault'
import { div, mulb } from '@kalani/lib/bmath'
import { fTokens, fUSD } from '@kalani/lib/format'
import { useMemo } from 'react'
import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import { getChain } from '../../../../lib/chains'
import ViewDateOrBlock from '../../../../components/elements/ViewDateOrBlock'
import { useAllocator, useTotalDebtRatio } from '../useAllocator'
import ViewBps from '../../../../components/elements/ViewBps'
import ViewGeneric from '../../../../components/elements/ViewGeneric'
import ChainImg from '../../../../components/ChainImg'
import TokenImg from '../../../../components/TokenImg'
import { zeroAddress } from 'viem'
import { useIsRelayed } from '../../Yhaas/Whitelist/TargetForm/VaultForm/useIsRelayed'
import { ROLES } from '@kalani/lib/types'
import LabelValueRow from '../../../../components/elements/LabelValueRow'

function Vitals({ vault }: { vault: Vault }) {
  const idle = useMemo(() => (vault?.totalAssets ?? 0n) - (vault?.totalDebt ?? 0n), [vault])
  const { totalDebtRatio } = useTotalDebtRatio()
  const { allocator } = useAllocator()

  const deployed = useMemo(() => {
    if (!totalDebtRatio) { return 0 }
    if (!vault?.totalDebt) { return 0 }
    const totalAllocated = mulb(vault?.totalAssets ?? 0n, Number(totalDebtRatio) / 10_000)
    return Math.floor(Number(div(vault?.totalDebt ?? 0n, totalAllocated)) * 10_000)
  }, [vault, totalDebtRatio])

  const { data: isRelayed } = useIsRelayed({
    vault: vault?.address ?? zeroAddress,
    chainId: vault?.chainId,
    rolemask: ROLES.REPORTING_MANAGER
  })

  return <Section>
    <div className="px-4 py-2 flex flex-col gap-primary">
      <LabelValueRow label="Network">
        <ViewGeneric className="flex items-center gap-4">
          <ChainImg chainId={vault.chainId} size={24} /> {getChain(vault.chainId).name}
        </ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Address">
        <EvmAddressChipSlide chainId={vault.chainId} address={vault.address} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Name">
        <ViewGeneric>{vault.name} ({vault.symbol})</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Asset">
        <div className="flex items-center justify-end gap-4">
          <TokenImg chainId={vault.chainId} address={vault.asset.address} size={24} bgClassName="bg-neutral-900" />
          <EvmAddressChipSlide chainId={vault.chainId} address={vault.asset.address} className="bg-neutral-900" />
        </div>
      </LabelValueRow>

      <LabelValueRow label="Asset name">
        <ViewGeneric>{vault.asset.name} ({vault.asset.symbol})</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Total assets">
        <ViewGeneric className="text-3xl font-bold">{fTokens(vault.totalAssets, vault.asset.decimals)}</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="TVL">
        <ViewGeneric>{fUSD(vault.tvl?.close ?? 0)}</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Price per share">
        <ViewGeneric>{fTokens(vault.pricePerShare ?? 0n, vault.asset.decimals, { fixed: 6 })}</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Allocated">
        <ViewBps bps={totalDebtRatio} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Deployed">
        <ViewBps bps={deployed} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Idle">
        <ViewGeneric>{fTokens(idle, vault.asset.decimals)}</ViewGeneric>
      </LabelValueRow>

      {vault.v3 && <LabelValueRow label="Deposit limit">
        <ViewGeneric>
          {fTokens(vault.deposit_limit ?? 0n, vault.asset.decimals, { fixed: 0, orInfiniteIfGt: 100_000_000_000_000 })}
        </ViewGeneric>
      </LabelValueRow>}

      <LabelValueRow label="Management fee">
        <ViewBps bps={vault.fees?.managementFee ?? 0} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Performance fee">
        <ViewBps bps={vault.fees?.performanceFee ?? 0} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Role manager">
        <EvmAddressChipSlide chainId={vault.chainId} address={vault.roleManager ?? zeroAddress} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Accountant">
        <EvmAddressChipSlide chainId={vault.chainId} address={vault.accountant ?? zeroAddress} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Allocator">
        <EvmAddressChipSlide chainId={vault.chainId} address={allocator ?? vault.allocator ?? zeroAddress} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="yHaaS automation">
        {isRelayed ? <ViewGeneric className="text-green-400">Enabled</ViewGeneric>
          : <ViewGeneric className="text-warn-400">Disabled</ViewGeneric>}
      </LabelValueRow>

      <LabelValueRow label="Version">
        <ViewGeneric>{vault.apiVersion}</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Inception">
        <ViewDateOrBlock timestamp={vault.inceptTime} block={vault.inceptBlock} className="bg-neutral-900" />
      </LabelValueRow>
    </div>
  </Section>
}

export default withVault(Vitals)
