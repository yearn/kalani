import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import ViewDateOrBlock from '../../../../components/elements/ViewDateOrBlock'
import { Vault } from '../../../../hooks/useVault'
import { withVault } from '../../../../hooks/useVault/withVault'
import { fPercent, fTokens, fUSD } from '@kalani/lib/format'
import { getChain } from '../../../../lib/chains'
import Section from '../../../../components/Section'
import TokenImg from '../../../../components/TokenImg'
import ChainImg from '../../../../components/ChainImg'
import ViewGeneric from '../../../../components/elements/ViewGeneric'
import LabelValueRow from '../../../../components/elements/LabelValueRow'
import { useBreakpoints } from '../../../../hooks/useBreakpoints'
import { Suspense } from 'react'
import { VitalsSkeleton } from '../../Vault/tabs/Vitals'

function VitalsComponent({ vault }: { vault: Vault }) {
  const { sm } = useBreakpoints()

  return <div className="flex flex-col gap-primary">
    <div className="hidden sm:flex flex-row gap-primary px-8 text-2xl xl:text-4xl">
      <div className="w-1/2 p-8 2xl:px-24 flex flex-col items-start justify-between xl:flex-row xl:items-center border-primary border-transparent sm:border-black rounded-primary">
        <div>TVL</div>
        <div>{fUSD(vault.tvl?.close ?? 0)}</div>
      </div>

      <div className="w-1/2 p-8 2xl:px-24 flex flex-col items-start justify-between xl:flex-row xl:items-center border-primary border-transparent sm:border-black rounded-primary">
        <div>APY</div>
        <div>{fPercent(vault.apy?.close ?? 0)}</div>
      </div>
    </div>

    <Section>
      <div className="flex flex-col gap-primary">
        <LabelValueRow label="TVL" className="sm:hidden text-3xl">
          <ViewGeneric>{fUSD(vault.tvl?.close ?? 0)}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="APY" className="sm:hidden text-3xl">
          <ViewGeneric>{fPercent(vault.apy?.close ?? 0)}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Type">
          <ViewGeneric>{'ERC4626'}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Network">
          <ViewGeneric className="flex items-center gap-4">
            <ChainImg chainId={vault.chainId} size={24} /> {getChain(vault.chainId).name}
          </ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Address">
          <EvmAddressChipSlide chainId={vault.chainId} address={vault.address} />
        </LabelValueRow>

        <LabelValueRow label="Name">
          <ViewGeneric className="w-[280px] sm:w-auto truncate text-right">{vault.name}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Symbol">
          <ViewGeneric>{vault.symbol}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Asset">
          <div className="flex items-center justify-end gap-4">
            <TokenImg chainId={vault.chainId} address={vault.asset.address} size={24} bgClassName="bg-neutral-900" />
            <EvmAddressChipSlide chainId={vault.chainId} address={vault.asset.address} />
          </div>
        </LabelValueRow>

        <LabelValueRow label="Asset name">
          <ViewGeneric>{vault.asset.name}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Asset symbol">
          <ViewGeneric>{vault.asset.symbol}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Total assets">
          <ViewGeneric className="text-3xl font-bold">{fTokens(vault.totalAssets, vault.asset.decimals, { truncate: !sm })}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="TVL">
          <ViewGeneric>{fUSD(vault.tvl?.close ?? 0)}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Price per share">
          <ViewGeneric>{fTokens(vault.pricePerShare ?? 0n, vault.asset.decimals, { fixed: 6 })}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Inception">
          <ViewDateOrBlock timestamp={vault.inceptTime} block={vault.inceptBlock} />
        </LabelValueRow>
      </div>
    </Section>
  </div>
}

const Suspender = withVault(VitalsComponent)

function Vitals() {
  return <Suspense fallback={<VitalsSkeleton />}>
    <Suspender />
  </Suspense>
}

export default Vitals
