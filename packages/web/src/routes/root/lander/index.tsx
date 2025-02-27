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
import String from '../../../strings/String'
import { useBreakpoints } from '../../../hooks/useBreakpoints'

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
  const nav = useHashNav('lets-go')
  return <div className="w-full min-h-screen flex items-center justify-center relative">
    <Bg />
    <section className={`
      w-full sm:w-[340px] lg:w-[480px] xl:w-[580px] mx-auto min-h-screen
      flex flex-col items-center justify-center gap-8`}>
      <div className="w-full h-full flex flex-col sm:flex-row sm:justify-center gap-16">
        <div className="w-full h-full pt-[6rem] flex flex-col items-center justify-center gap-16">
          <div className="px-8 sm:px-0 flex flex-col items-start justify-end gap-3 text-neutral-900">
            <Wordmark className="py-2 text-3xl text-secondary-2000">Kalani</Wordmark>
            <p className="font-bold text-5xl text-secondary-2000">
              Get your users the best yields in DeFi
            </p>
          </div>
          <div className="w-full px-8 sm:px-0">
            <Button className="py-6 text-2xl bg-secondary-2000 shadow-xl" onClick={nav.toggle}>
              <CTA>🚀 Let's go</CTA>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
}

function RightHero() {
  const Highlight = ({ children }: { children: ReactNode }) => <span className="font-bold text-primary-400 group-active:text-secondary-400">{children}</span>
  return <div className="w-full min-h-screen bg-secondary-2000 flex items-center justify-center relative">
    <section className="px-4 flex flex-col items-start justify-center gap-16 text-neutral-300">
      <Feature href="/build" 
        icon={<PiVault size={96} />} 
        title="Build" 
        description=<>Build <Highlight>vaults</Highlight> on Yearn V3 protocol, allocate to any 4626 vault or strategy</>
      />
      <Feature href="/yhaas" 
        icon={<PiRobot size={96} />} 
        title="Automate" 
        description=<>Automate the <Highlight>tending and harvesting</Highlight> of your vaults with Yearn yHaaS</>
      />
      <Feature href="/" 
        icon={<PiMoneyWavy size={96} />} 
        title="Earn" 
        description=<>Earn management <Highlight>fees</Highlight> on your vaults, claim them in the app</>
      />
    </section>
  </div>
}

function LetsGo() {
  return <div className="w-[360px] sm:w-[380px] flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-bold">Create a project</h1>
      <p className="text-neutral-500"><String _key="new-project-p" /></p>
    </div>
    <Connect className="w-full py-6 border-neutral-800" short />
    <NewProject dialogId="lets-go" />
  </div>
}

export default function Lander() {
  const mounted = useMounted()
  const nav = useHashNav('lets-go')
  const { sm } = useBreakpoints()

  return <div className="relative w-full min-h-screen flex flex-col sm:flex-row sm:overflow-hidden">
    {!nav.isOpen && <Header />}

    <AnimatePresence>
      {!nav.isOpen && <FlyInFromBottom _key="left-hero" breakpoint={sm} transition={springs.slowRoll} exit={1} parentMounted={mounted} 
        className="w-full sm:w-1/2 min-h-screen">
        <LeftHero />
      </FlyInFromBottom>}
    </AnimatePresence>

    <AnimatePresence>
      {!nav.isOpen && <FlyInFromTop _key="right-hero" breakpoint={sm} transition={springs.slowRoll} exit={1} parentMounted={mounted} 
        className="w-full sm:w-1/2 min-h-screen">
        <RightHero />
      </FlyInFromTop>}
    </AnimatePresence>

    <AnimatePresence>
      {nav.isOpen && <FlyInFromBottom _key="lets-go" transition={springs.slowGlitch} exit={1} 
        className="absolute z-50 inset-0 flex flex-col items-center justify-center gap-8">
        <LetsGo />
      </FlyInFromBottom>}
    </AnimatePresence>
  </div>
}
