import Header from './Header'
import Bg from './Bg'
import Finder from '../../components/Finder'
import Wordmark from '../../components/Wordmark'
import { PiMagnifyingGlass, PiRabbit, PiVault } from 'react-icons/pi'

export default function Lander() {
  return <div className="w-full min-h-screen flex items-center justify-center">
    <Bg />
    <Header />
    <section className={`
      w-[580px] mx-auto min-h-screen
      flex flex-col items-center justify-center gap-8`}>
      <div className="w-full h-full flex flex-col sm:flex-row sm:justify-center gap-16">
        <div className="z-10 w-full h-full pb-[10rem] flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col items-center justify-end gap-3">
            <Wordmark className="px-12 py-2 text-5xl">Kalani</Wordmark>
            <p>Yearn vault control center</p>
          </div>
          <Finder className="w-full drop-shadow-[0_35px_35px_rgba(0,0,0,1)]" placeholder='Search by vault / token / address' />
        </div>
      </div>
      <div className="hidden flex items-center justify-center gap-48 text-neutral-300">
        <div className="flex flex-col items-center justify-center gap-4">
          <PiMagnifyingGlass size={96} />
          <h2>Explore</h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <PiVault size={96} />
          <h2>Build</h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <PiRabbit size={96} />
          <h2>Automate</h2>
        </div>
      </div>
    </section>
  </div>
}
