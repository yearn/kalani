import { useVaultFromParams } from '../../../hooks/useVault'
import { fPercent, fUSD } from '@kalani/lib/format'
import Vitals from './tabs/Vitals'
import ChainImg from '../../../components/ChainImg'
import Hero, { HeroInset } from '../../../components/Hero'
import TokenImg from '../../../components/TokenImg'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'

const tabClassNames = {
  textClassName: 'text-neutral-950 group-active:text-neutral-950/60',
  bgClassName: `
    [[data-open=true]_&]:bg-neutral-950 
    group-hover:bg-neutral-950 
    group-active:bg-neutral-950/60
  `
}

function Suspender() {
  const { vault } = useVaultFromParams()

  if (!vault) return <></>

  return <section className="flex flex-col gap-8">
    <Hero className="bg-secondary-400 text-neutral-950">
      <div className="flex flex-col justify-center gap-2">
        <div className={`text-4xl font-fancy`}>{vault.name}</div>

        <div className="flex items-center gap-12">
          <div className="text-2xl font-bold">
            TVL {fUSD(vault.tvl?.close ?? 0)}
          </div>
          <div className="text-2xl font-bold">
            APY {fPercent(vault.apy?.close ?? NaN)}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <ChainImg chainId={vault.chainId} size={28} />
          <TokenImg chainId={vault.chainId} address={vault.asset.address} size={28} bgClassName="bg-neutral-950" />
          <div className="px-3 py-1 bg-neutral-950 text-secondary-400 rounded-full">erc4626</div>
          <EvmAddressChipSlide chainId={vault.chainId} address={vault.address} className="bg-neutral-950 text-secondary-400" />
        </div>

        <div></div>
      </div>

      <HeroInset>
        <Tabs className="flex gap-4">
          <Tab id="vitals" isDefault={true} classNames={tabClassNames}>Vitals</Tab>
        </Tabs>
      </HeroInset>
    </Hero>

    <div className="w-full px-12">
      <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
    </div>
  </section>
}

export default function Erc4626() {
  return <Suspense fallback={<Skeleton className="h-48" />}>
    <Suspender />
  </Suspense>
}