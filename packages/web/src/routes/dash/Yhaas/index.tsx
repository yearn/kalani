import { PiRobot } from 'react-icons/pi'
import Whitelist from './Whitelist'
import { useYhaasStats } from './useYhaasStats'
import { Suspense, useMemo } from 'react'
import bmath from '@kalani/lib/bmath'
import { formatEther } from 'viem'
import usePrices from '../../../hooks/usePrices'
import Odometer from 'react-odometerjs'
import { fNumber } from '@kalani/lib/format'
import Skeleton from '../../../components/Skeleton'
import Hero from '../../../components/Hero'

function Brand() {
  return <div className="flex items-center gap-6">
    <PiRobot size={64} />
    <div className="flex flex-col gap-0">
      <div className="flex items-end gap-1">
        <div className="text-4xl font-fancy">y</div>
        <div className="text-5xl font-fancy">H</div>
        <div className="text-4xl font-fancy">aa</div>
        <div className="text-5xl font-fancy">S</div>
      </div>
      <div className="text-xs tracking-widest">Yearn Harvest as a Service</div>
    </div>
  </div>
}

function useWethPrice() {
  const prices = usePrices(1, ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'])
  return { ...prices, price: prices.data['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'] }
}

function Metrics() {
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

  return <div className="flex items-end gap-12">
    <div className="relative hidden sm:block flex flex-col items-start">
      <div className="pb-1 text-xl">{fNumber(totalAutomations, { fixed: 0, full: true })}</div>
      <div className="absolute -bottom-5 text-sm text-nowrap">
        Automations
      </div>
    </div>

    <div className="relative flex flex-col items-start">
      <div className="text-xs text-nowrap">gas saved with yHaaS</div>
      <div className="text-6xl text-nowrap">
        <Odometer value={gasSaved} format="(,ddd).dddd" /> Ξ
      </div>
      <div className="absolute -bottom-5 text-sm text-nowrap">
        $ <Odometer value={gasSavedUsd} format="(,ddd).dd" />
      </div>
    </div>
  </div>
}

export default function Page() {
  return <section className="flex flex-col gap-8">
    <Suspense fallback={<Skeleton className="h-48" />}>
      <Hero className="text-neutral-950 bg-zinc-400">
        <Brand />
        <Metrics />
      </Hero>
    </Suspense>

    <div className="px-8 flex flex-col items-center gap-12">
      <p>.. ..... ... ....... ........ ..... ....... . .. . ...... ..... .... ........ ..... ..... ....... ... ... .... .... .... .... ........ .... ..... ..... ....... ...... ....... ....... . ... ... .. ....... ... ....... ..... ....... .. ... .... ..... .... ........ ....... .. ....... . . ..... .... .... . . .. ...... ....... ..... .... .. .... .... .. ..... ....... .... ....... ... ........ .. ... ...</p>
      <Whitelist />
    </div>
  </section>
}
