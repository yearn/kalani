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
    router.push(`/dash?account=${q}`)
  }, [router])

  return <main className="relative w-full min-h-screen">
    <div className={`
      w-6xl max-w-6xl mx-auto pt-[6rem]
      flex flex-col items-center justify-start gap-8`}>
      <div className="w-full h-full pt-32 flex flex-col sm:flex-row sm:justify-center gap-16">
        <div className="w-full sm:w-1/2 h-full flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col items-center justify-center gap-0">
            <Fancy className="w-full font-[900] text-4xl">Kalani</Fancy>
            <p>Yearn automations droid</p>
          </div>
          <Search className="w-full" onSearch={onSearch} />
        </div>
      </div>
    </div>
  </main>
}
