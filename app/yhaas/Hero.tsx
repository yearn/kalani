import A from '@/components/controls/A'
import Image from 'next/image'

export default function Hero() {
  return <div className="w-full p-4 sm:px-12 sm:py-0 flex items-center justify-between gap-12 bg-pink-900/20 rounded">
    <div className="sm:w-[40%] py-8 hidden sm:flex items-center justify-center rounded">
      <Image priority={true} src="/otto.png" alt="yAuto" width={425} height={256} className="p-4 border border-pink-400 rounded" />
    </div>
    <div className="w-full sm:w-[60%] flex flex-col gap-8">
      <h1 className="font-[900] text-6xl">yHaaS Whitelist</h1>
      <div className="pl-4 flex flex-col gap-2 border-l border-pink-400">
        <p className="text-xl rainbow-text">
          You have no strategy anon. Let&apos;s fix that!
        </p>
        <p>
          Automate all your strategy&apos;s harvests/reports/rebalancing/tending with ease!
        </p>
        <p>
          <A href="https://github.com/mil0xeth/yHaaS" target="_blank" rel="noopener noreferrer" className="a">github</A>
        </p>
      </div>
    </div>
  </div>
}