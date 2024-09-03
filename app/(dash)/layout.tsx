'use client'

import { useEffect } from "react"

export default function Layout({
  children,
  test
}: {
  children: React.ReactNode,
  test: React.ReactNode
}) {
  useEffect(() => console.log('test', test), [test])
  return <section className={`
    min-w-[800px] px-24 py-12 
    flex justify-end`}>
    test{test}
    <div className="w-[1024px]">{children}</div>
  </section>
}
