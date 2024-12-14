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
import { PiCaretDown, PiCaretUp, PiWallet } from 'react-icons/pi'
import { Tab, Tabs } from '../../../components/Tabs'
import { useAccountOptions } from './useAccountOptions'
import { cn } from '../../../lib/shadcn'
import { compareEvmAddresses } from '@kalani/lib/strings'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import ChainImg from '../../../components/ChainImg'

function Suspender({ address }: { address: EvmAddress }) {
  const { chainId: chainIdFromAccount, address: addressFromAccount } = useAccount()
  const isUserWallet = useMemo(() => addressFromAccount === address, [addressFromAccount, address])
  const user = useAccountVaults(address)
  const { items, findRoleForItem } = useAccountItems(address ?? zeroAddress)
  const chainId = user?.vaults[0]?.chainId ?? chainIdFromAccount ?? 1
  const isContract = useIsContract(chainId, address)
  const title = useMemo(() => isContract ? 'Multisig' : isUserWallet ? 'Your Wallet' : 'EOA', [isContract, isUserWallet])
  const { sortKey, sortDirection, setSortKey } = useAccountOptions()

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
            <div className="text-xs tracking-widest">Managed projects and vaults</div>
          </div>
        </div>

        <div className="flex items-end gap-10 pr-4">
          <div className="text-4xl font-bold">{fUSD(tvl)}</div>
          <div className="text-4xl font-bold">{fPercent(apy, { padding: { length: 2, fill: '0' } })}</div>
        </div>
      </div>

      <HeroInset>
        <Tabs className="w-full xl:pr-16 items-end justify-between">
          <div className="pl-20 pb-28 flex items-center gap-3 text-sm pointer-events-auto">
            <ChainImg chainId={chainId} size={28} />
            <EvmAddressChipSlide chainId={chainId} address={address} className="bg-primary-400 text-neutral-950" />
          </div>

          <div className="flex items-center gap-3">
            <Tab selected={sortKey === 'tvl'} onClick={() => setSortKey('tvl')} className={cn('pl-3', sortKey === 'tvl' ? '!text-primary-400' : 'text-black active:text-primary-400')}>
              {sortDirection === 'desc' ? <PiCaretDown size={16} className={sortKey === 'tvl' ? 'text-primary-400' : 'text-transparent'} /> : <PiCaretUp size={16} className={sortKey === 'tvl' ? 'text-primary-400' : 'text-transparent'} />}
              TVL
            </Tab>
            <Tab selected={sortKey === 'apy'} onClick={() => setSortKey('apy')} className={cn('pl-3', sortKey === 'apy' ? '!text-primary-400' : 'text-black active:text-primary-400')}>
              {sortDirection === 'desc' ? <PiCaretDown size={16} className={sortKey === 'apy' ? 'text-primary-400' : 'text-transparent'} /> : <PiCaretUp size={16} className={sortKey === 'apy' ? 'text-primary-400' : 'text-transparent'} />}
              APY
            </Tab>
          </div>
        </Tabs>
      </HeroInset>
    </Hero>

    <div className="w-full p-2 sm:px-4 sm:py-8 flex flex-col sm:gap-8">
      {sorted.map((item) => 
        <ListItem key={`${item.chainId}-${item.address}`} item={item} roleMask={findRoleForItem(item)?.roleMask} isRoleManager={compareEvmAddresses(item.roleManager ?? zeroAddress, address)}  />
      )}
    </div>
  </section>
}

export default function Account({ address }: { address: EvmAddress }) {
  return <Suspense fallback={<Skeleton className="h-48" />}>
    <Suspender address={address} />
  </Suspense>
}
