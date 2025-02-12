import { useVaultFromParams } from '../../../hooks/useVault'
import { fPercent, fUSD } from '@kalani/lib/format'
import Roles from './tabs/Roles'
import Vitals from './tabs/Vitals'
import Allocator from './tabs/Allocator'
import Reports from './tabs/Reports'
import HeroElement, { HeroInset, HeroTitle } from '../../../components/Hero'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import TokenImg from '../../../components/TokenImg'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import { useAllocator } from './useAllocator'
import Fees from './tabs/Fees'
import { EvmAddress } from '@kalani/lib/types'
import { getChain } from '../../../lib/chains'

export interface VaultHeroProps {
  name: string
  chainId: number
  address: EvmAddress
  assetAddress: EvmAddress
  tvl: number | undefined
  apy: number | undefined
  chip?: React.ReactNode
  inset?: React.ReactNode
}

export function VaultHero({
  name,
  chainId,
  address,
  assetAddress,
  tvl,
  apy,
  chip,
  inset
}: VaultHeroProps) {
  return <HeroElement className="bg-secondary-400 text-neutral-950">
    <div className="w-full flex flex-col justify-center gap-0 pb-4">

      <div className="flex items-start gap-4 text-xl">
        <TokenImg chainId={chainId} address={assetAddress} size={64} showChain={true} bgClassName="border-secondary-400" />
        <div className="w-full flex flex-col gap-1">
          <HeroTitle>{name}</HeroTitle>
          <div className="-mt-1 flex items-center gap-3 font-bold">
            <div>{getChain(chainId).name}</div>
            <div>//</div>
            <div>
              <EvmAddressChipSlide chainId={chainId} address={address} className="bg-secondary-400" />
            </div>
            <div>//</div>
            <div>{chip}</div>
          </div>
        </div>
      </div>

      <div className="pl-1 flex items-center gap-12 text-4xl tracking-widest font-bold drop-shadow-lg">
        <div className="">
          TVL {fUSD(tvl ?? 0)}
        </div>
        <div className="">
          APY {fPercent(apy) ?? '-.--%'}
        </div>
      </div>
    </div>

    <HeroInset className="pb-1">
      {inset}

      {/* <div className="absolute bottom-0 right-12 border">
        <PricePerShareChart series={[
          { x: '2020-01-01', y: 50 },
          { x: '2020-01-02', y: 10 },
          { x: '2020-01-03', y: 20 },
        ]} />
      </div> */}
    </HeroInset>

  </HeroElement>
}

function Hero() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  if (!vault) return <></>

  const projectChip = vault.yearn ? 'Yearn Allocator' : `${vault.projectName} Allocator`

  return <VaultHero
    name={vault.name}
    chainId={vault.chainId}
    address={vault.address}
    assetAddress={vault.asset.address}
    tvl={vault.tvl?.close ?? 0}
    apy={vault.apy?.close}
    chip={projectChip}
    inset={<Tabs className="mb-2 w-full">
      <Tab id="vitals" isDefault={true}>Vitals</Tab>
      {allocator && <Tab id="allocator">Allocator</Tab>}
      <Tab id="fees">Fees</Tab>
      <Tab id="reports">Reports</Tab>
      <Tab id="roles">Roles</Tab>
    </Tabs>}
  />
}

function Content() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  if (!vault) return <></>

  return <div className="relative w-full px-8">
    <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
    {allocator && <TabContent id="allocator"><Allocator /></TabContent>}
    <TabContent id="fees"><Fees /></TabContent>
    <TabContent id="reports"><Reports /></TabContent>
    <TabContent id="roles"><Roles /></TabContent>
  </div>
}

function VaultSkeleton() {
  return <div className="px-8 flex flex-col gap-8">
    <Skeleton className="w-full h-40 my-4 rounded-primary" />
    <Skeleton className="w-full h-24 rounded-primary" />
    <Skeleton className="w-full h-24 rounded-primary" />
    <Skeleton className="w-full h-24 rounded-primary" />
    <Skeleton className="w-full h-24 rounded-primary" />
  </div>
}

export default function Vault() {
  return <section className="flex flex-col gap-8">
    <Suspense fallback={<VaultSkeleton />}>
      <Hero />
      <Content />
    </Suspense>
  </section>
}
