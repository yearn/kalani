import { useVaultFromParams } from '../../../hooks/useVault'
import { fPercent, fUSD } from '@kalani/lib/format'
import Roles from './tabs/Roles'
import Vitals from './tabs/Vitals'
import Allocator from './tabs/Allocator'
import Reports from './tabs/Reports'
import ChainImg from '../../../components/ChainImg'
import Hero, { HeroInset, HeroTitle } from '../../../components/Hero'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import TokenImg from '../../../components/TokenImg'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import { useAllocator } from './useAllocator'
import Fees from './tabs/Fees'

function VaultHero() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  if (!vault) return <></>

  return <Hero className="bg-secondary-400 text-neutral-950">
    <div className="w-full flex flex-col justify-center gap-2 pb-2">
      <HeroTitle>{vault.name}</HeroTitle>

      <div className="flex items-center gap-12">
        <div className="text-2xl font-bold">
          TVL {fUSD(vault.tvl?.close ?? 0)}
        </div>
        <div className="text-2xl font-bold">
          APY {fPercent(vault.apy?.close) ?? '-.--%'}
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <ChainImg chainId={vault.chainId} size={28} />
        <TokenImg chainId={vault.chainId} address={vault.asset.address} size={28} bgClassName="bg-neutral-950" />
        <div className="px-3 py-1 bg-neutral-950 text-secondary-400 rounded-full">
          {vault.yearn ? 'Yearn Allocator' : `${vault.projectName} Allocator`}
        </div>
        <EvmAddressChipSlide chainId={vault.chainId} address={vault.address} className="bg-neutral-950 text-secondary-400" />
      </div>

      <div></div>
    </div>

    <HeroInset>
      <Tabs>
        <Tab id="vitals" isDefault={true}>Vitals</Tab>
        {allocator && <Tab id="allocator">Allocator</Tab>}
        <Tab id="fees">Fees</Tab>
        <Tab id="reports">Reports</Tab>
        <Tab id="roles">Roles</Tab>
      </Tabs>
    </HeroInset>
  </Hero>
}

function VaultContent() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  if (!vault) return <></>

  return <div className="w-full px-12">
    <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
    {allocator && <TabContent id="allocator"><Allocator /></TabContent>}
    <TabContent id="fees"><Fees /></TabContent>
    <TabContent id="reports"><Reports /></TabContent>
    <TabContent id="roles"><Roles /></TabContent>
  </div>
}

export default function Vault() {
  return <section className="flex flex-col gap-10">
    <Suspense fallback={<Skeleton className="h-48" />}>
      <VaultHero />
      <VaultContent />
    </Suspense>
  </section>
}
