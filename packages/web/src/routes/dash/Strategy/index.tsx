import Vitals from './tabs/Vitals'
import Reports from './tabs/Reports'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import { useStrategyFromParams } from '../../../hooks/useStrategy'
import { Suspense } from 'react'
import { VaultHero, VaultHeroSkeleton } from '../Vault'
import { useBreakpoints } from '../../../hooks/useBreakpoints'
import DepositWithdraw from '../../../components/DepositWithdraw'

const tabClassName = `
bg-secondary-400/20
text-secondary-400
data-[selected=true]:bg-secondary-400
hover:bg-secondary-400/40
active:bg-secondary-400/60
`

function Hero() {
  const { strategy } = useStrategyFromParams()
  const { sm } = useBreakpoints()

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
        {!sm && <Tab id="deposits" isDefault={true} className={tabClassName}>Deposit</Tab>}
        <Tab id="vitals" isDefault={sm} className={tabClassName}>Vitals</Tab>
        <Tab id="reports" className={tabClassName}>Reports</Tab>
      </Tabs>}
    />
  </section>
}

function WrapperDepositWithdraw() {
  function Suspender() {
    const { strategy } = useStrategyFromParams()
    if (!strategy) return <></>
    return <DepositWithdraw chainId={strategy.chainId} vault={strategy.address} />
  }

  return <Suspense fallback={<></>}>
    <Suspender />
  </Suspense>
}

export default function Strategy() {
  const { sm } = useBreakpoints()

  return <section className="flex flex-col">
    <Suspense fallback={<VaultHeroSkeleton />}>
      <Hero />
    </Suspense>

    <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
      {!sm && <TabContent id="deposits" isDefault={true}><WrapperDepositWithdraw /></TabContent>}
      <TabContent id="vitals" isDefault={sm}><Vitals /></TabContent>
      <TabContent id="reports"><Reports /></TabContent>
    </div>
  </section>
}
