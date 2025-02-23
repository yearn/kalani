import Vitals from './tabs/Vitals'
import Reports from './tabs/Reports'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import { useStrategyFromParams } from '../../../hooks/useStrategy'
import { Suspense } from 'react'
import { VaultHero, VaultHeroSkeleton } from '../Vault'

function Hero() {
  const { strategy } = useStrategyFromParams()
  return <section className="flex flex-col gap-8">
    <VaultHero
      name={strategy.name}
      chainId={strategy.chainId}
      address={strategy.address}
      assetAddress={strategy.asset.address}
      tvl={strategy.tvl.close}
      apy={strategy.apy?.close}
      chip="tokenized strategy"
      inset={<Tabs className="w-full pb-3 pl-2 sm:pl-0">
        <Tab id="vitals" isDefault={true}>Vitals</Tab>
        <Tab id="reports">Reports</Tab>
      </Tabs>}
    />
  </section>
}

export default function Strategy() {
  return <section className="flex flex-col gap-8">
    <Suspense fallback={<VaultHeroSkeleton />}>
      <Hero />
    </Suspense>

    <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
      <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
      <TabContent id="reports"><Reports /></TabContent>
    </div>
  </section>
}
