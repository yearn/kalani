import { PiRabbitFill } from 'react-icons/pi'
import Whitelist from './Whitelist'
import { WhitelistProvider } from './Whitelist/provider'

function Brand() {
  return <div className="flex items-center gap-6 pl-4">
    <PiRabbitFill size={64} />
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
  return <div className="flex items-center gap-20">
    <div className="hidden 2xl:block flex flex-col items-start">
      <div className="text-xl">308</div>
      <div className="text-xs text-balance">Automations</div>
    </div>

    <div className="hidden 2xl:block flex flex-col items-start">
      <div className="text-xl">6,568</div>
      <div className="text-xs">Harvests</div>
    </div>

    <div className="flex flex-col items-start">
      <div className="text-xs text-nowrap">gas saved with yHaaS</div>
      <div className="text-6xl text-nowrap">3.4303 Ξ</div>
      <div className="text-sm text-nowrap">$ 11,619</div>
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
