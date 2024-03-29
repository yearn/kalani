'use client'

import { useRouter } from 'next/navigation'
import Connect from '@/components/Connect'
import Fancy from '@/components/Fancy'
import Screen from '@/components/Screen'
import Search from '@/components/Search'
import { useCallback } from 'react'

export default function Home() {
  const router = useRouter()

  const onSearch = useCallback((q: string) => {
    router.push(`/dash`)
  }, [router])

  return <main className="relative w-full min-h-screen">
    <div className={`
      w-6xl max-w-6xl mx-auto pt-[6rem]
      flex flex-col items-center justify-start gap-8`}>
      <div className="w-full h-full pt-32 flex flex-col sm:flex-row gap-16">
        <div className="w-full sm:w-1/2 h-full flex flex-col items-start justify-center gap-4">
          <Fancy className="w-full font-[900] text-6xl">Kalani</Fancy>
          <Screen>
            Bresaola prosciutto leberkas, bacon ground round shank kielbasa chicken. Porchetta meatloaf strip steak, salami andouille buffalo chuck corned beef brisket ribeye cupim. Beef cupim brisket, buffalo meatloaf t-bone ribeye chicken kielbasa capicola bresaola ham turducken. Chicken ground round pig buffalo drumstick bacon. Drumstick biltong corned beef rump kielbasa. T-bone pork shank biltong pork belly, turkey tail tri-tip bresaola boudin alcatra jowl meatloaf capicola.
          </Screen>
        </div>
        <div className="w-full sm:w-1/2 flex flex-col items-center justify-center gap-12">
          <div><Connect className="" /></div>
          <div className="w-[62%] text-orange-1000 text-lg border-b"></div>
          <div className="w-[80%] flex flex-col items-start">
            <Search className="w-full" onSearch={onSearch} />
          </div>
        </div>
      </div>
    </div>
  </main>
}
