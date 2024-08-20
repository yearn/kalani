'use client'

import Wordmark from '@/components/Wordmark'
import Finder from '@/components/Finder'
import Bg from './Bg'
import Header from './Header'

export default function Page() {
  return <main className="relative w-full min-h-screen">
    <Bg />
    <Header />
    <div className={`
      w-6xl max-w-6xl mx-auto min-h-screen
      flex flex-col items-center justify-center gap-8`}>
      <div className="w-full h-full flex flex-col sm:flex-row sm:justify-center gap-16">
        <div className="w-full sm:w-1/2 h-full pb-[10rem] flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col items-center justify-end gap-3">
            <Wordmark className="px-12 py-2 text-5xl">Zookeeper</Wordmark>
            <div className="z-10">Yearn vault control center</div>
          </div>
          <Finder className="w-full drop-shadow-[0_35px_35px_rgba(0,0,0,1)]" placeholder='Search by address / vault / token' />
        </div>
      </div>
    </div>
  </main>
}
