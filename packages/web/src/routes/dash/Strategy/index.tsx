import Vitals from './tabs/Vitals'
import Reports from './tabs/Reports'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import { useStrategyFromParams } from '../../../hooks/useStrategy'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import { VaultHero } from '../Vault'

function Suspender() {
  const { strategy } = useStrategyFromParams()

  return <section className="flex flex-col gap-8">
    <VaultHero
      name={strategy.name}
      chainId={strategy.chainId}
      address={strategy.address}
      assetAddress={strategy.asset.address}
      tvl={strategy.tvl.close}
      apy={strategy.apy?.close}
      chip={<div className="px-3 py-1 bg-neutral-950 text-secondary-400 rounded-full">yearn strategy</div>}
      inset={<Tabs>
        <Tab id="vitals" isDefault={true}>Vitals</Tab>
        <Tab id="reports">Reports</Tab>
      </Tabs>}
    />


    <div className="w-full px-12">
      <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
      <TabContent id="reports"><Reports /></TabContent>
    </div>
  </section>
}

export default function Strategy() {
  return <Suspense fallback={<Skeleton className="h-48" />}>
    <Suspender />
  </Suspense>
}
