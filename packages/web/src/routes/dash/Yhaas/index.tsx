import { PiRobot } from 'react-icons/pi'
import Whitelist from './Whitelist'
import { WhitelistProvider } from './Whitelist/provider'
import { useYhaasStats } from './useYhaasStats'
import { useMemo } from 'react'
import bmath from '@kalani/lib/src/bmath'
import { formatEther } from 'viem'

function Brand() {
  return <div className="flex items-center gap-6 pl-4">
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

function Metrics() {
  const { stats } = useYhaasStats()

  const totalAutomations = useMemo(() => {
    return Object.values(stats).reduce((acc, chain) => acc + chain.executors.reduce((acc, executor) => acc + executor.automations, 0), 0)
  }, [stats])

  const gasSaved = useMemo(() => {
    const c = 1.715
    const gasSpent = stats[1].executors.reduce((acc, executor) => acc + executor.gas, 0n)
    const gasThatWouldHaveBeenSpent = bmath.mulb(gasSpent, c)
    return gasThatWouldHaveBeenSpent - gasSpent
  }, [stats])

  return <div className="flex items-center gap-20">
    <div className="hidden 2xl:block flex flex-col items-start">
      <div className="text-xl">{totalAutomations}</div>
      <div className="text-xs text-balance">Automations</div>
    </div>

    <div className="hidden 2xl:block flex flex-col items-start">
      <div className="text-xl">6,568</div>
      <div className="text-xs">Harvests</div>
    </div>

    <div className="flex flex-col items-start">
      <div className="text-xs text-nowrap">gas saved with yHaaS</div>
      <div className="text-6xl text-nowrap">3.4303 Ξ</div>
      <div className="text-sm text-nowrap">$ 11,619 ({formatEther(gasSaved)})</div>
    </div>
   
  </div>
}

export default function Page() {
  return <div className="flex flex-col gap-8">
    <div className="flex items-center justify-between gap-12">
      <Brand />
      <Metrics />
    </div>
    <p>
      .. ..... ... ....... ........ ..... ....... . .. . ...... ..... .... ........ ..... ..... ....... ... ... .... .... .... .... ........ .... ..... ..... ....... ...... ....... ....... . ... ... .. ....... ... ....... ..... ....... .. ... .... ..... .... ........ ....... .. ....... . . ..... .... .... . . .. ...... ....... ..... .... .. .... .... .. ..... ....... .... ....... ... ........ .. ... ...
    </p>

    <WhitelistProvider>
      <Whitelist />
    </WhitelistProvider>
  </div>
}
