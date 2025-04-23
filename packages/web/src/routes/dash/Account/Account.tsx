import { fPercent, fUSD } from '@kalani/lib/format'
import { EvmAddress } from '@kalani/lib/types'
import Hero, { HeroInset, HeroIcon } from '../../../components/Hero'
import { useAccount } from 'wagmi'
import { Suspense, useMemo } from 'react'
import Skeleton from '../../../components/Skeleton'
import { zeroAddress } from 'viem'
import { useAccountItems } from './useAccountItems'
import { ListItem } from '../Explore/ListItem'
import { PiWallet } from 'react-icons/pi'
import { Tab, TabContent, Tabs } from '../../../components/Tabs'
import { useAccountOptions } from './useAccountOptions'
import { useProjects } from '../../../components/SelectProject/useProjects'
import LinkButton from '../../../components/elements/LinkButton'
import ChainImg from '../../../components/ChainImg'
import { useLocation } from 'react-router-dom'
import Fancy from '../../../components/Fancy'

const tabClassName = `
bg-neutral-950
text-neutral-400
data-[selected=true]:bg-secondary-400
hover:bg-neutral-800
active:bg-neutral-900
`

function Suspender({ address }: { address: EvmAddress }) {
  const { address: addressFromAccount } = useAccount()
  const isUserWallet = useMemo(() => addressFromAccount === address, [addressFromAccount, address])
  const { items } = useAccountItems(address ?? zeroAddress)
  const location = useLocation()
  const title = useMemo(() => location.pathname === '/' ? 'Wallet' : 'Account', [location])
  const { sortKey, sortDirection } = useAccountOptions()
  const { projects } = useProjects(undefined, addressFromAccount)

  const sorted = useMemo(() => {
    return items.sort((a, b) => {
      if (sortKey === 'tvl') return sortDirection === 'desc' ? (b.tvl ?? 0) - (a.tvl ?? 0) : (a.tvl ?? 0) - (b.tvl ?? 0)
      if (sortKey === 'apy') return sortDirection === 'desc' ? (b.apy ?? 0) - (a.apy ?? 0) : (a.apy ?? 0) - (b.apy ?? 0)
      return 0
    })
  }, [items, sortKey, sortDirection])

  const tvl = useMemo(() => {
    return sorted.reduce((acc, item) => acc + (item.tvl ?? 0), 0)
  }, [sorted])

  const apy = useMemo(() => {
    const totalTvl = sorted.reduce((sum, item) => sum + (item.tvl ?? 0), 0)
    if (totalTvl === 0) return 0

    const weightedApySum = sorted.reduce((acc, item) => {
      const weight = (item.tvl ?? 0) / totalTvl
      return acc + (item.apy ?? 0) * weight
    }, 0)

    return weightedApySum
  }, [sorted])

  if (!address) return <></>

  return <section className="flex flex-col">
    <Hero>
      <div className="w-full flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <HeroIcon icon={PiWallet} className="bg-secondary-400" />
          <Fancy text={title} />
        </div>

        {!isUserWallet && <div className="hidden flex items-end gap-10 pr-4 pb-0 drop-shadow-lg">
          <div className="text-4xl font-bold">{fUSD(tvl)}</div>
          <div className="text-4xl font-bold">{fPercent(apy, { padding: { length: 2, fill: '0' } })}</div>
        </div>}
      </div>

      <HeroInset>
        {isUserWallet && <Tabs className="w-full pb-3 pl-2 sm:pl-0">
          <Tab id="vaults" isDefault={true} className={tabClassName}>Vaults</Tab>
          <Tab id="projects" className={tabClassName}>Projects</Tab>
        </Tabs>}
      </HeroInset>
    </Hero>

    <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
      <TabContent id="vaults" isDefault={true}>
        <div className="p-3 flex flex-col gap-3">
          {sorted.map((item) =>
            <ListItem key={`${item.chainId}-${item.address}`} item={item} />
          )}
        </div>
      </TabContent>

      {isUserWallet && <TabContent id="projects">
        <div className="p-3 flex flex-col gap-3">
          {projects.map(project => <LinkButton
            key={project.id} 
            to={`/project/${project.chainId}/${project.id}`} 
            h="tertiary" 
            className="py-12 grow flex items-center justify-start text-3xl">
              <ChainImg chainId={project.chainId} size={48} className="mr-6 sm:ml-8 sm:mr-12" />
              <div className="max-w-full truncate">{project.name}</div>
            </LinkButton>)}
        </div>
      </TabContent>}
    </div>
  </section>
}

function _Skeleton() {
  return <Hero>
    <div className="w-full flex items-center justify-between gap-6">
      <div className="flex items-center gap-6 drop-shadow-lg">
        <HeroIcon icon={PiWallet} className="bg-secondary-400" />
        <Fancy text="Wallet" />
      </div>

      <div className="hidden sm:flex items-end gap-10 pr-4 pb-0 drop-shadow-lg">
        <div className="text-4xl font-bold"><Skeleton className="w-24 h-6 rounded-primary" /></div>
        <div className="text-4xl font-bold"><Skeleton className="w-24 h-6 rounded-primary" /></div>
      </div>
    </div>

    <HeroInset className="flex gap-4 pb-4">
      <Skeleton className="w-24 h-8 rounded-full" />
      <Skeleton className="w-24 h-8 rounded-full" />
    </HeroInset>
  </Hero>
}

export default function Account({ address }: { address: EvmAddress }) {
  return <Suspense fallback={<_Skeleton />}>
    <Suspender address={address} />
  </Suspense>
}
