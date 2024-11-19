import { useVaultFromParams } from '../../../hooks/useVault'
import { fPercent, fUSD } from '@kalani/lib/format'
import Roles from './tabs/Roles'
import Vitals from './tabs/Vitals'
import Strategies from './tabs/Strategies'
import Accountant from './tabs/Accountant'
import Allocator from './tabs/Allocator'
import Reports from './tabs/Reports'
import ChainImg from '../../../components/ChainImg'
import Hero, { HeroInset } from '../../../components/Hero'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import TokenImg from '../../../components/TokenImg'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import { useAllocator } from './useAllocator'

const tabClassNames = {
  textClassName: 'text-secondary-950 group-active:text-secondary-950/60',
  bgClassName: `
    [[data-open=true]_&]:bg-secondary-950 
    group-hover:bg-secondary-950 
    group-active:bg-secondary-950/60
  `
}

function VaultHero() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  if (!vault) return <></>

  return <Hero className="bg-secondary-400 text-secondary-950">
    <div className="flex flex-col justify-center gap-2">
      <div className={`text-4xl font-fancy`}>{vault.name}</div>

      <div className="flex items-center gap-12">
        <div className="text-2xl font-bold">
          TVL {fUSD(vault.tvl?.close ?? 0)}
        </div>
        <div className="text-2xl font-bold">
          APY {fPercent(vault.apy?.close) ?? '-.--%'}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <ChainImg chainId={vault.chainId} size={28} />
        <TokenImg chainId={vault.chainId} address={vault.asset.address} size={28} bgClassName="bg-secondary-950" />
        <div className="px-3 py-1 bg-secondary-950 text-secondary-400 rounded-full">
          {vault.yearn ? 'Yearn Allocator' : `${vault.projectName} Allocator`}
        </div>
        <EvmAddressChipSlide chainId={vault.chainId} address={vault.address} className="bg-secondary-950 text-secondary-400" />
      </div>

      <div></div>
    </div>

    <HeroInset>
      <Tabs className="flex gap-4">
        <Tab id="vitals" isDefault={true} classNames={tabClassNames}>Vitals</Tab>
        {allocator && <Tab id="allocator" classNames={tabClassNames}>Allocator</Tab>}
        <Tab id="strategies" classNames={tabClassNames}>Strategies</Tab>
        <Tab id="accountant" classNames={tabClassNames}>Accountant</Tab>
        <Tab id="reports" classNames={tabClassNames}>Reports</Tab>
        <Tab id="roles" classNames={tabClassNames}>Roles</Tab>
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
    <TabContent id="strategies"><Strategies /></TabContent>
    <TabContent id="accountant"><Accountant /></TabContent>
    <TabContent id="reports"><Reports /></TabContent>
    <TabContent id="roles"><Roles /></TabContent>
  </div>
}

export default function Vault() {
  return <section className="flex flex-col gap-8">
    <Suspense fallback={<Skeleton className="h-48" />}>
      <VaultHero />
      <VaultContent />
    </Suspense>    

    {/* <div className="w-full flex items-center gap-8">
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>
        </table>
      </Screen>
      <div className={`
        w-1/2 h-full p-4 text-primary-200`}>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td>Total assets</td>
              <td className="text-right">{fTokens(vault.totalAssets, vault.asset.decimals)}</td>
            </tr>
            <tr>
              <td>Allocated</td>
              <td className="text-right">{fBps(allocated)}</td>
            </tr>
            <tr>
              <td>Deployed</td>
              <td className="text-right">{fPercent(deployed)}</td>
            </tr>
            <tr>
              <td>Idle assets</td>
              <td className="text-right">{fTokens(idle, vault.asset.decimals)}</td>
            </tr>
            <tr>
              <td>Deposit limit</td>
              <td className="text-right">{fTokens(vault.deposit_limit, vault.asset.decimals, { fixed: 0 })}</td>
            </tr>
            <tr>
              <td>Accountant</td>
              <td className="text-right">{fEvmAddress(vault.accountant)}</td>
            </tr>
            <tr>
              <td>Performance fee</td>
              <td className="text-right">{fBps(vault.fees.performanceFee)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="w-full flex items-start gap-8">
      <div className={`w-1/2 h-full p-4 text-primary-200`}>
        <div className="text-xl">Strategies</div>
        {vault.strategies.map(strategy => <div key={strategy.address}>
          {strategy.name}
        </div>)}
      </div>
      <Screen className={`
        w-1/2 p-4 flex items-center justify-between
        border border-neutral-800`}>
        <div className="grow flex flex-col items-center">
          <Pie data={currentDebtPieData} size={200} />
          <div>current debt</div>
        </div>
        <div className="grow flex flex-col items-center">
          <Pie data={targetDebtPieData} size={200} />
          <div>target debt</div>
        </div>
      </Screen>
    </div>

    <div className="w-full flex items-start gap-8">
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>
        </table>
      </Screen>
      <div className={`w-1/2 h-full p-4 text-primary-200`}>
        <div className="text-xl">Roles</div>
      </div>
    </div> */}
  </section>
}
