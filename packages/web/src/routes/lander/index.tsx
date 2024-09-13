import Header from './Header'
import Bg from './Bg'
import Finder from '../../components/Finder'
import Wordmark from '../../components/Wordmark'
import { PiMagnifyingGlass, PiVault, PiRobot, PiCaretDoubleDownBold, PiCaretDoubleUpBold } from 'react-icons/pi'
import { useRef, ReactNode, useState, useEffect } from 'react'
import Button from '../../components/elements/Button'

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
    w-64 h-full p-4 flex flex-col items-center justify-center text-center gap-4
    border border-transparent hover:border-secondary-200 rounded-primary`}>
    {icon}
    <h2 className="font-bold font-fancy text-2xl">{title}</h2>
    <p>{description}</p>
  </a>
}

export default function Lander() {
  const firstSectionRef = useRef<HTMLDivElement>(null)
  const secondSectionRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState<'first' | 'second'>('first')

  const scrollToNextSection = () => {
    if (currentSection === 'first') {
      secondSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      setCurrentSection('second')
    } else {
      firstSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      setCurrentSection('first')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      if (scrollPosition < windowHeight / 2) {
        setCurrentSection('first')
      } else {
        setCurrentSection('second')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full">
      <div ref={firstSectionRef} className="min-h-screen flex items-center justify-center relative">
        <Bg />
        <Header />
        <section className={`
          w-[580px] mx-auto min-h-screen
          flex flex-col items-center justify-center gap-8`}>
          <div className="w-full h-full flex flex-col sm:flex-row sm:justify-center gap-16">
            <div className="z-10 w-full h-full pb-[10rem] flex flex-col items-center justify-center gap-16">
              <div className="flex flex-col items-center justify-end gap-3">
                <Wordmark className="px-12 py-2 text-5xl">Kalani</Wordmark>
                <p>Yearn vault super center</p>
              </div>
              <Finder className="w-full drop-shadow-[0_35px_35px_rgba(0,0,0,.92)]" placeholder='Search by vault / token / address' />
            </div>
          </div>
        </section>
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2">
          <Button h="secondary" onClick={scrollToNextSection} className={`
            text-neutral-600 border-transparent drop-shadow-[0_12px_12px_rgba(0,0,0,.52)]`}>
            <PiCaretDoubleDownBold size={20} />
         </Button>
        </div>
      </div>
      <div ref={secondSectionRef} className="min-h-screen bg-primary-2000 flex items-center justify-center relative">
        <section className="max-w-[80%] flex items-start justify-center gap-32 text-neutral-300">
          <Feature href="/account" 
            icon={<PiMagnifyingGlass size={96} />} 
            title="Explore" 
            description=<>Explore the universe of yield bearing <span className="font-bold text-primary-400">4626 vaults</span></>
          />
          <Feature href="/account" 
            icon={<PiVault size={96} />} 
            title="Build" 
            description=<>Build your own 4626 vaults using <span className="font-bold text-primary-400">Yearn V3</span> protocol</>
          />
          <Feature href="/yhaas" 
            icon={<PiRobot size={96} />} 
            title="Automate" 
            description=<>Automate your vaults and strategies with <span className="font-bold text-primary-400">Yearn yHaaS</span></>
          />
        </section>
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2">
          <Button h="secondary" onClick={scrollToNextSection} className={`
            text-neutral-600 border-transparent drop-shadow-[0_12px_12px_rgba(0,0,0,.52)]`}>
            <PiCaretDoubleUpBold size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
