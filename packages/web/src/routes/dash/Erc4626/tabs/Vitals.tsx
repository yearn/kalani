import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import ViewDateOrBlock from '../../../../components/elements/ViewDateOrBlock'
import { Vault, withVault } from '../../../../hooks/useVault'
import { fTokens, fUSD } from '@kalani/lib/format'
import { getChain } from '../../../../lib/chains'
import Section from '../../../../components/Section'
import TokenImg from '../../../../components/TokenImg'
import ChainImg from '../../../../components/ChainImg'
import ViewGeneric from '../../../../components/elements/ViewGeneric'
import LabelValueRow from '../../../../components/elements/LabelValueRow'

function Vitals({ vault }: { vault: Vault }) {
  return <Section>
    <div className="px-4 py-2 flex flex-col gap-6">

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

      <LabelValueRow label="Inception">
        <ViewDateOrBlock timestamp={vault.inceptTime} block={vault.inceptBlock} className="bg-neutral-900" />
      </LabelValueRow>
    </div>
  </Section>
}

export default withVault(Vitals)