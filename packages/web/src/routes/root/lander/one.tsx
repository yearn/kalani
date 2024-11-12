import Header from './Header'
import Bg from './Bg'
import Finder from '../../../components/Finder'
import Wordmark from '../../../components/Wordmark'
import { PiMagnifyingGlass, PiVault, PiRobot } from 'react-icons/pi'
import { ReactNode } from 'react'

function Feature({
  icon, 
  title, 
  description,
  href
}: { 
  icon: ReactNode, 
  title: string, 
  description: ReactNode,
  href: string
}) {
  return <a href={href} className={`group
    h-full p-6 flex items-center justify-center gap-6 sm:gap-8
    border-primary border-transparent hover:border-secondary-200 
    active:border-secondary-400 active:text-secondary-400
    saber-glow rounded-primary`}>
    {icon}
    <div className="lg:w-64 xl:w-96 flex flex-col items-start  gap-2">
      <h2 className="font-bold font-fancy text-2xl">{title}</h2>
      <p>{description}</p>
    </div>
  </a>
}

export default function Lander() {
  return <div className="w-full flex flex-col sm:flex-row">
    <Header />

    <div className="w-full sm:w-1/2 sm:min-h-screen flex items-center justify-center relative">
      <Bg />

      <section className={`
        w-full sm:w-[340px] lg:w-[480px] xl:w-[580px] mx-auto min-h-screen
        flex flex-col items-center justify-center gap-8`}>
        <div className="w-full h-full flex flex-col sm:flex-row sm:justify-center gap-16">
          <div className="w-full h-full pb-[10rem] flex flex-col items-center justify-center gap-16">
            <div className="flex flex-col items-center justify-end gap-3 text-neutral-900">
              <Wordmark className="px-12 py-2 text-5xl">Kalani</Wordmark>
              <p className="font-bold text-xl">Yearn Vault Super Center</p>
            </div>
            <div className="w-full px-8 sm:px-0">
              <Finder placeholder='Find yield bearing vaults' />
            </div>
          </div>
        </div>
      </section>
    </div>

    <div className="w-full sm:w-1/2 min-h-screen bg-primary-2000 flex items-center justify-center relative">
      <section className="px-4 flex flex-col items-start justify-center gap-16 text-neutral-300">
        <Feature href="/explore" 
          icon={<PiMagnifyingGlass size={96} />} 
          title="Explore" 
          description=<>Explore the universe of yield bearing <span className="font-bold text-primary-400 group-active:text-secondary-400">4626 vaults</span></>
        />
        <Feature href="/build" 
          icon={<PiVault size={96} />} 
          title="Build" 
          description=<>Build your own 4626 vaults using <span className="font-bold text-primary-400 group-active:text-secondary-400">Yearn V3</span> protocol</>
        />
        <Feature href="/yhaas" 
          icon={<PiRobot size={96} />} 
          title="Automate" 
          description=<>Automate your vaults and strategies with <span className="font-bold text-primary-400 group-active:text-secondary-400">Yearn yHaaS</span></>
        />
      </section>
    </div>
  </div>
}
