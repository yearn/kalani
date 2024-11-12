import Header from './Header'
import Bg from './Bg'
import Wordmark from '../../../components/Wordmark'
import { PiVault, PiRobot, PiMoneyWavy } from 'react-icons/pi'
import { ReactNode } from 'react'
import Button from '../../../components/elements/Button'
import CTA from '../../../components/CTA'
import FlyInFromBottom from '../../../components/motion/FlyInFromBottom'
import { AnimatePresence } from 'framer-motion'
import { useMounted } from '../../../hooks/useMounted'
import FlyInFromTop from '../../../components/motion/FlyInFromTop'
import { springs } from '../../../lib/motion'
import NewProject from '../../../components/SelectProject/NewProject'
import { useHashNav } from '../../../hooks/useHashNav'
import Connect from '../../../components/Connect'

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

function LeftHero() {
  const nav = useHashNav('get-started')
  return <div className="w-full min-h-screen flex items-center justify-center relative">
    <Bg />
    <section className={`
      w-full sm:w-[340px] lg:w-[480px] xl:w-[580px] mx-auto min-h-screen
      flex flex-col items-center justify-center gap-8`}>
      <div className="w-full h-full flex flex-col sm:flex-row sm:justify-center gap-16">
        <div className="w-full h-full pt-[6rem] flex flex-col items-center justify-center gap-16">
          <div className="px-8 sm:px-0 flex flex-col items-start justify-end gap-3 text-neutral-900">
            <Wordmark className="py-2 text-3xl">Kalani</Wordmark>
            <p className="font-bold text-5xl">Get your users the best yields in DeFi</p>
          </div>
          <div className="w-full px-8 sm:px-0">
            <Button className="py-6 text-2xl" onClick={nav.toggle}>
              <CTA>🚀 Get started</CTA>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
}

function RightHero() {
  return <div className="w-full min-h-screen bg-primary-2000 flex items-center justify-center relative">
    <section className="px-4 flex flex-col items-start justify-center gap-16 text-neutral-300">
      <Feature href="/build" 
        icon={<PiVault size={96} />} 
        title="Build" 
        description=<>Build vaults on <span className="font-bold text-primary-400 group-active:text-secondary-400">Yearn V3</span> protocol, allocate to any 4626 vault or strategy</>
      />
      <Feature href="/yhaas" 
        icon={<PiRobot size={96} />} 
        title="Automate" 
        description=<>Automate your vaults and strategies with <span className="font-bold text-primary-400 group-active:text-secondary-400">Yearn yHaaS</span></>
      />
      <Feature href="/fees" 
        icon={<PiMoneyWavy size={96} />} 
        title="Earn" 
        description=<>Earn management <span className="font-bold text-primary-400 group-active:text-secondary-400">fees</span> on your vaults, claim them in the app</>
      />
    </section>
  </div>
}

function GetStarted() {
  return <div className="w-[280px] flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-bold">Create a project</h1>
      <p className="text-neutral-500">Projects are unique groups of addresses used for deploying and managing your vaults.</p>
    </div>
    <Connect className="w-full py-6 border-neutral-800" short />
    <NewProject dialogId="get-started" />
  </div>
}

export default function Lander() {
  const mounted = useMounted()
  const nav = useHashNav('get-started')

  return <div className="relative w-full min-h-screen flex flex-col sm:flex-row">
    {!nav.isOpen && <Header />}

    <AnimatePresence>
      {!nav.isOpen && <FlyInFromBottom _key="left-hero" transition={springs.slowRoll} exit={1} waitForMount={!mounted} 
        className="w-full sm:w-1/2 min-h-screen">
        <LeftHero />
      </FlyInFromBottom>}
    </AnimatePresence>

    <AnimatePresence>
      {!nav.isOpen && <FlyInFromTop _key="right-hero" transition={springs.slowRoll} exit={1} waitForMount={!mounted} 
        className="w-full sm:w-1/2 min-h-screen">
        <RightHero />
      </FlyInFromTop>}
    </AnimatePresence>

    <AnimatePresence>
      {nav.isOpen && <FlyInFromBottom _key="get-started" transition={springs.slowGlitch} exit={1} 
        className="absolute z-50 inset-0 flex flex-col items-center justify-center gap-8">
        <GetStarted />
      </FlyInFromBottom>}
    </AnimatePresence>
  </div>
}
