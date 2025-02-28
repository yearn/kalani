import { Suspense, useMemo } from 'react'
import Section from '../../../../components/Section'
import LabelValueRow from '../../../../components/elements/LabelValueRow'
import ViewGeneric from '../../../../components/elements/ViewGeneric'
import { formatEther } from 'viem'
import bmath from '@kalani/lib/bmath'
import { useYhaasStats } from '../useYhaasStats'
import ReactOdometer from 'react-odometerjs'
import usePrices from '../../../../hooks/usePrices'
import { chains } from '../../../../lib/chains'
import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import { useAccount } from 'wagmi'
import { useRelayers } from './Apply/relayers'
import Skeleton from '../../../../components/Skeleton'

function useWethPrice() {
  const prices = usePrices(1, ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'])
  return { ...prices, price: prices.data['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'] }
}

function Suspender() {
  const { chainId } = useAccount()
  const relayers = useRelayers(chainId ?? 1)
  const { stats } = useYhaasStats()

  const totalAutomations = useMemo(() => {
    return Object.values(stats).reduce((acc, chain) => acc + chain.executors.reduce((acc, executor) => acc + executor.automations, 0), 0)
  }, [stats])

  const gasSaved = useMemo(() => {
    const c = 1.715
    const gasSpent = stats[1].executors.reduce((acc, executor) => acc + executor.gas, 0n)
    const gasThatWouldHaveBeenSpent = bmath.mulb(gasSpent, c)
    const wei = gasThatWouldHaveBeenSpent - gasSpent
    return parseFloat(formatEther(wei))
  }, [stats])

  const { price: wethPrice } = useWethPrice()

  const gasSavedUsd = useMemo(() => {
    return gasSaved * wethPrice
  }, [gasSaved, wethPrice])

  return <Section>
    <div className="flex flex-col gap-primary">
      <LabelValueRow label="Gas saved by yHaaS">
        <ViewGeneric className="flex items-center gap-4">
          <div className="flex flex-col gap-0">
            <div className="text-4xl text-nowrap"><ReactOdometer value={gasSaved} format="(,ddd).dddd" /> Ξ</div>
            <div className="text-neutral-400">$ <ReactOdometer value={gasSavedUsd} format="(,ddd).dd" /></div>
          </div>
        </ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label={`Automations across ${chains.length} chains`}>
        <ViewGeneric className="flex items-center gap-4 text-2xl text-nowrap">
          <ReactOdometer value={totalAutomations} format="(,ddd).dd" />
        </ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Relayer">
        <EvmAddressChipSlide chainId={chainId ?? 1} address={relayers[0]} className="bg-neutral-900" />
      </LabelValueRow>
    </div>
  </Section>
}

function _Skeleton() {
  return <Section>
    <div className="flex flex-col gap-primary">
      <LabelValueRow label="Gas saved by yHaaS">
        <Skeleton className="w-52 h-16 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label={`Automations across ${chains.length} chains`}>
        <Skeleton className="w-32 h-12 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="Relayer">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>
    </div>
  </Section>
}

export default function Vitals() {
  return <Suspense fallback={<_Skeleton />}>
    <Suspender />
  </Suspense>
}
