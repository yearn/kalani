import { fPercent, fTokens, fUSD } from '@kalani/lib/format'
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
import { useIsRelayed } from '../../Yhaas/tabs/Apply/TargetForm/StrategyForm/useIsRelayed'
import { zeroAddress } from 'viem'
import { useBreakpoints } from '../../../../hooks/useBreakpoints'
import { VitalsSkeleton } from '../../Vault/tabs/Vitals'

function Suspender() {
  const { strategy } = useStrategyFromParams()
  const { data: isRelayed } = useIsRelayed({ chainId: strategy.chainId, strategy: strategy.address })
  const { sm } = useBreakpoints()

  return <div className="flex flex-col gap-primary">
    <div className="hidden sm:flex flex-row gap-primary px-8 text-2xl xl:text-4xl">
      <div className="grow p-8 2xl:px-24 flex flex-col items-start justify-between xl:flex-row xl:items-center border-primary border-transparent sm:border-black rounded-primary">
        <div>TVL</div>
        <div>{fUSD(strategy.tvl?.close ?? 0)}</div>
      </div>

      <div className="grow p-8 2xl:px-24 flex flex-col items-start justify-between xl:flex-row xl:items-center border-primary border-transparent sm:border-black rounded-primary">
        <div>APY</div>
        <div>{fPercent(strategy.apy?.close ?? 0)}</div>
      </div>
    </div>

    <Section>
      <div className="flex flex-col gap-primary">
        <LabelValueRow label="TVL" className="sm:hidden text-3xl">
          <ViewGeneric>{fUSD(strategy.tvl?.close ?? 0)}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="APY" className="sm:hidden text-3xl">
          <ViewGeneric>{fPercent(strategy.apy?.close ?? 0)}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Type">
          <ViewGeneric>{'Tokenized strategy'}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Network">
          <ViewGeneric className="flex items-center gap-4">
            <ChainImg chainId={strategy.chainId} size={24} /> {getChain(strategy.chainId).name}
          </ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Address">
          <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.address} />
        </LabelValueRow>

        <LabelValueRow label="Name">
          <ViewGeneric className="w-[280px] sm:w-auto truncate text-right">{strategy.name}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Asset">
          <div className="flex items-center justify-end gap-4">
            <TokenImg chainId={strategy.chainId} address={strategy.asset.address} size={24} />
            <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.asset.address} />
          </div>
        </LabelValueRow>

        <LabelValueRow label="Asset name">
          <ViewGeneric>{strategy.asset.name}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Asset symbol">
          <ViewGeneric>{strategy.asset.symbol}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Total assets">
          <ViewGeneric className="text-3xl font-bold">{fTokens(strategy.totalAssets, strategy.asset.decimals, { truncate: !sm })}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="TVL">
          <ViewGeneric>{fUSD(strategy.tvl?.close ?? 0)}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Price per share">
          <ViewGeneric>{fTokens(strategy.pricePerShare ?? 0n, strategy.asset.decimals, { fixed: 6 })}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Performance fee">
          <ViewBps bps={strategy.fees?.performanceFee ?? 0} />
        </LabelValueRow>

        <LabelValueRow label="Management">
          <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.management ?? zeroAddress} />
        </LabelValueRow>

        <LabelValueRow label="Keeper">
          <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.keeper ?? zeroAddress} />
        </LabelValueRow>

        <LabelValueRow label="Health check">
          <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.healthCheck ?? zeroAddress} />
        </LabelValueRow>

        <LabelValueRow label="yHaaS automation">
          {isRelayed ? <ViewGeneric className="text-green-400">Enabled</ViewGeneric>
            : <ViewGeneric className="text-warn-400">Disabled</ViewGeneric>}
        </LabelValueRow>

        <LabelValueRow label="Version">
          <ViewGeneric>{strategy.apiVersion}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Inception">
          <ViewDateOrBlock timestamp={strategy.inceptTime} block={strategy.inceptBlock} />
        </LabelValueRow>
      </div>
    </Section>
  </div>
}

export default function Vitals() {
  return <Suspense fallback={<VitalsSkeleton />}>
    <Suspender />
  </Suspense>
}
