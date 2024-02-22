'use client'

import Hero from './Hero'
import Form from './Form'

export default function yHaaS() {
  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem]
    flex min-h-screen flex-col items-center justify-start gap-8`}>
    <Hero />
    <Form />
  </main>
}
