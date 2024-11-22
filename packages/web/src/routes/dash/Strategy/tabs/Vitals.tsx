import { fTokens, fUSD } from '@kalani/lib/format'
import { useStrategyFromParams } from '../../../../hooks/useStrategy'
import { Suspense } from 'react'
import Section from '../../../../components/Section'
import ViewBps from '../../../../components/elements/ViewBps'
import { getChain } from '../../../../lib/chains'
import ChainImg from '../../../../components/ChainImg'
import ViewGeneric from '../../../../components/elements/ViewGeneric'
import LabelValueRow from '../../../../components/elements/LabelValueRow'
import TokenImg from '../../../../components/TokenImg'
import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import ViewDateOrBlock from '../../../../components/elements/ViewDateOrBlock'
import { useIsRelayed } from '../../Yhaas/Whitelist/TargetForm/StrategyForm/useIsRelayed'

function Suspender() {
  const { strategy } = useStrategyFromParams()
  const { data: isRelayed } = useIsRelayed({ chainId: strategy.chainId, strategy: strategy.address })

  return <Section>
    <div className="px-4 py-2 flex flex-col gap-6">

      <LabelValueRow label="Network">
        <ViewGeneric className="flex items-center gap-4">
          <ChainImg chainId={strategy.chainId} size={24} /> {getChain(strategy.chainId).name}
        </ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Address">
        <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.address} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Name">
        <ViewGeneric>{strategy.name} ({strategy.symbol})</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Asset">
        <div className="flex items-center justify-end gap-4">
          <TokenImg chainId={strategy.chainId} address={strategy.asset.address} size={24} bgClassName="bg-neutral-900" />
          <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.asset.address} className="bg-neutral-900" />
        </div>
      </LabelValueRow>

      <LabelValueRow label="Asset name">
        <ViewGeneric>{strategy.asset.name} ({strategy.asset.symbol})</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Total assets">
        <ViewGeneric className="text-3xl font-bold">{fTokens(strategy.totalAssets, strategy.asset.decimals)}</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="TVL">
        <ViewGeneric>{fUSD(strategy.tvl?.close ?? 0)}</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Price per share">
        <ViewGeneric>{fTokens(strategy.pricePerShare ?? 0n, strategy.asset.decimals, { fixed: 6 })}</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Performance fee">
        <ViewBps bps={strategy.fees?.performanceFee ?? 0} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="yHaaS automation">
        {isRelayed ? <ViewGeneric className="text-green-400">Enabled</ViewGeneric>
          : <ViewGeneric className="text-warn-400">Disabled</ViewGeneric>}
      </LabelValueRow>

      <LabelValueRow label="Version">
        <ViewGeneric>{strategy.apiVersion}</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Inception">
        <ViewDateOrBlock timestamp={strategy.inceptTime} block={strategy.inceptBlock} className="bg-neutral-900" />
      </LabelValueRow>
    </div>
  </Section>
}

export default function Vitals() {
  return <Suspense fallback={<></>}>
    <Suspender />
  </Suspense>
}
