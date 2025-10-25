import { useVaultFromParams } from '../../../hooks/useVault/withVault'
import Roles from './tabs/Roles'
import Vitals from './tabs/Vitals'
import Allocator from './tabs/Allocator'
import Allocator2 from './tabs/Allocator2'
import Reports from './tabs/Reports'
import HeroElement, { HeroInset, HeroTitle } from '../../../components/Hero'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import TokenImg from '../../../components/TokenImg'
import { Suspense } from 'react'
import Skeleton, { SkeletonTab } from '../../../components/Skeleton'
import { useAllocator } from './useAllocator'
import Fees from './tabs/Fees'
import { EvmAddress } from '@kalani/lib/types'
import { useBreakpoints } from '../../../hooks/useBreakpoints'
import { cn } from '../../../lib/shadcn'
import DepositWithdraw from '../../../components/DepositWithdraw'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'

const tabClassName = `
bg-neutral-950
text-neutral-400
data-[selected=true]:bg-secondary-400
hover:bg-neutral-800
active:bg-neutral-900
`

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
  inset
}: VaultHeroProps) {
  const { sm } = useBreakpoints()

  return <HeroElement>
    <div className="w-full flex flex-col justify-center gap-2 sm:gap-0 sm:pb-4">

      <div className="flex items-center gap-4 text-xl">
        <div className="mb-1">
          <TokenImg chainId={chainId} address={assetAddress} size={sm ? 72 : 48} showChain={true} bgClassName="border-black" />
        </div>

        <div className="relative w-[300px] sm:w-full flex flex-col sm:gap-1">
          <HeroTitle>{name}</HeroTitle>
          <div className="absolute -bottom-[1.5rem]">
            <EvmAddressChipSlide chainId={chainId} address={address} className="!py-0 text-base bg-black" />
          </div>
        </div>
      </div>
    </div>

    <HeroInset>
      {inset}
    </HeroInset>

  </HeroElement>
}

function Hero() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()
  const { sm } = useBreakpoints()

  if (!vault) return <></>

  return <VaultHero
    name={vault.name}
    chainId={vault.chainId}
    address={vault.address}
    assetAddress={vault.asset.address}
    tvl={vault.tvl?.close ?? 0}
    apy={vault.apy?.close}
    inset={<Tabs className="w-full pb-3 pl-2 sm:pl-0">
      {!sm && <Tab id="deposits" isDefault={true} className={tabClassName}>Deposit</Tab>}
      <Tab id="vitals" isDefault={sm} className={tabClassName}>Vitals</Tab>
      {allocator && <Tab id="allocator" className={tabClassName}>Allocator</Tab>}
      <Tab id="allocator2" className={tabClassName}>Allocator 2</Tab>
      <Tab id="fees" className={tabClassName}>Fees</Tab>
      <Tab id="reports" className={tabClassName}>Reports</Tab>
      <Tab id="roles" className={tabClassName}>Roles</Tab>
    </Tabs>}
  />
}

function WrapperDepositWithdraw() {
  function Suspender() {
    const { vault } = useVaultFromParams()
    if (!vault) return <></>
    return <DepositWithdraw chainId={vault.chainId} vault={vault.address} />
  }

  return <Suspense fallback={<></>}>
    <Suspender />
  </Suspense>
}

function Content() {
  const { sm } = useBreakpoints()
  return <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
    {!sm && <TabContent id="deposits" isDefault={true}><WrapperDepositWithdraw /></TabContent>}
    <TabContent id="vitals" isDefault={sm}><Vitals /></TabContent>
    <TabContent id="allocator"><Allocator /></TabContent>
    <TabContent id="allocator2"><Allocator2 /></TabContent>
    <TabContent id="fees"><Fees /></TabContent>
    <TabContent id="reports"><Reports /></TabContent>
    <TabContent id="roles"><Roles /></TabContent>
  </div>
}

export function VaultHeroSkeleton() {
  const { sm } = useBreakpoints()
  return <HeroElement>
    <div className="w-full flex flex-col justify-center gap-2 sm:pb-4">
      <div className="flex items-center gap-6 text-xl">
        <Skeleton className={cn(sm ? 'w-[68px] h-[64px] rounded-full' : 'w-[58px] h-[48px] rounded-full')} />
        <Skeleton className="w-64 sm:w-96 h-10 sm:h-12 rounded-primary" />
      </div>
    </div>

    <HeroInset>
      <Tabs className="w-full pb-3 pl-2 sm:pl-0">
        <SkeletonTab />
        <SkeletonTab />
        <SkeletonTab />
      </Tabs>
    </HeroInset>
  </HeroElement>
}

export default function Vault() {
  return <section className="flex flex-col">
    <Suspense fallback={<VaultHeroSkeleton />}>
      <Hero />
    </Suspense>
    <Content />
  </section>
}
