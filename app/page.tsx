'use client'

import { useRouter } from 'next/navigation'
import Wordmark from '@/components/Wordmark'
import Search from '@/components/Search'
import { useCallback } from 'react'
import Screen from '@/components/Screen'

export default function Home() {
  const router = useRouter()

  const onSearch = useCallback((q: string) => {
    router.push(`/account/${q}`)
  }, [router])

  return <main className="relative w-full min-h-screen">
    <div className={`
      w-6xl max-w-6xl mx-auto pt-[6rem]
      flex flex-col items-center justify-start gap-8`}>
      <div className="w-full h-full pt-32 flex flex-col sm:flex-row sm:justify-center gap-16">
        <div className="w-full sm:w-1/2 h-full flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col items-center justify-end gap-3">
            <Screen className="px-12 py-2">
              <Wordmark className="text-5xl">Kalani</Wordmark>
            </Screen>
            <p>Yearn vault automations</p>
          </div>
          <Search className="w-full" onSearch={onSearch} />
        </div>
      </div>
    </div>
  </main>
}
