import { useAccountVaults } from './useAccountVaults'
import { fPercent, fUSD } from '@kalani/lib/format'
import { EvmAddress } from '@kalani/lib/types'
import Hero, { HeroInset } from '../../../components/Hero'
import { useIsContract } from '../../../hooks/useIsContract'
import { useAccount } from 'wagmi'
import { Suspense, useMemo } from 'react'
import Skeleton from '../../../components/Skeleton'
import { zeroAddress } from 'viem'
import { useAccountItems } from './useAccountItems'
import { ListItem } from '../Explore/ListItem'
import { PiWallet } from 'react-icons/pi'
import { Tab, TabContent, Tabs } from '../../../components/Tabs'
import { useAccountOptions } from './useAccountOptions'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useProjects } from '../../../components/SelectProject/useProjects'
import LinkButton from '../../../components/elements/LinkButton'
import ChainImg from '../../../components/ChainImg'

function Suspender({ address }: { address: EvmAddress }) {
  const { chainId: chainIdFromAccount, address: addressFromAccount } = useAccount()
  const isUserWallet = useMemo(() => addressFromAccount === address, [addressFromAccount, address])
  const user = useAccountVaults(address)
  const { items, findRoleForItem } = useAccountItems(address ?? zeroAddress)
  const chainId = user?.vaults[0]?.chainId ?? chainIdFromAccount ?? 1
  const isContract = useIsContract(chainId, address)
  const title = useMemo(() => isContract ? 'Multisig' : isUserWallet ? 'Wallet' : 'EOA', [isContract, isUserWallet])
  const { sortKey, sortDirection } = useAccountOptions()
  const { projects } = useProjects(chainIdFromAccount, addressFromAccount)

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

  return <section className="flex flex-col gap-0">
    <Hero className="bg-primary-400 text-neutral-950">
      <div className="w-full flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <PiWallet size={64} />
          <div className="flex flex-col gap-0">
            <div className="flex items-end gap-1">
              <div className="text-5xl font-fancy">{title.charAt(0)}</div>
              <div className="text-4xl font-fancy">{title.slice(1)}</div>
            </div>
          </div>
        </div>

        {!isUserWallet && <div className="hidden flex items-end gap-10 pr-4 pb-0 drop-shadow-lg">
          <div className="text-4xl font-bold">{fUSD(tvl)}</div>
          <div className="text-4xl font-bold">{fPercent(apy, { padding: { length: 2, fill: '0' } })}</div>
        </div>}
      </div>

      <HeroInset>
        {isUserWallet && <Tabs className="w-full pb-3 pl-2 sm:pl-0">
          <Tab id="vaults" isDefault={true} className="text-black active:text-primary-400 data-[selected=true]:text-primary-400">Vaults</Tab>
          <Tab id="projects" className="text-black active:text-primary-400 data-[selected=true]:text-primary-400">Projects</Tab>
        </Tabs>}
      </HeroInset>
    </Hero>

    <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
      <TabContent id="vaults" isDefault={true}>
        <div className="p-3 flex flex-col gap-3">
          {sorted.map((item) =>
            <ListItem key={`${item.chainId}-${item.address}`} item={item} roleMask={findRoleForItem(item)?.roleMask} isRoleManager={compareEvmAddresses(item.roleManager ?? zeroAddress, address)}  />
          )}
        </div>
      </TabContent>

      {isUserWallet && <TabContent id="projects">
        <div className="p-3 flex flex-col gap-3">
          {projects.map(project => <LinkButton
            key={project.id} 
            to={`/project/${project.chainId}/${project.id}`} 
            h="tertiary" 
            className="px-4 py-12 grow flex items-center justify-start gap-4 text-3xl">
              <ChainImg chainId={project.chainId} size={48} />
              {project.name}
            </LinkButton>)}
        </div>
      </TabContent>}
    </div>
  </section>
}

function _Skeleton() {
  return <Hero className="bg-primary-400 text-neutral-950">
    <div className="w-full flex items-center justify-between gap-6">
      <div className="flex items-center gap-6 drop-shadow-lg">
        <PiWallet size={64} />
        <div className="flex flex-col gap-0">
          <div className="flex items-end gap-1">
            <div className="text-4xl font-fancy"><Skeleton className="w-48 h-10 rounded-primary" /></div>
          </div>
        </div>
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
