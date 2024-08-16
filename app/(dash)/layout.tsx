'use client'

import Header from './Header'
import Drawer from './Drawer'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type AsideContextType = {
  aside: ReactNode
  setAside: (aside: ReactNode) => void
}

const AsideContext = createContext<AsideContextType>({
  aside: <></>,
  setAside: () => {},
})

export const useAside = () => useContext(AsideContext)

export const AsideProvider = ({ children }: { children: ReactNode }) => {
  const [aside, setAside] = useState<ReactNode>(<></>)
  return <AsideContext.Provider value={{ aside, setAside }}>
    {children}
  </AsideContext.Provider>
}

function _Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { aside } = useAside()
  return <section className="bg-black">
    <Header className="sticky z-50 inset-x-0 top-0 w-full" />
    <Drawer className="fixed z-50 top-0 left-0 w-24 h-screen" />
    <div className="flex items-start">
      <div className="w-24"></div>

      <div className="isolate grow min-w-[800px] border-r border-r-primary-1000">
        {children}
      </div>

      <aside className={`w-[26%] min-w-[380px] h-screen`}>
        {aside}
      </aside>
    </div>
  </section>
}

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return <AsideProvider>
    <_Layout>{children}</_Layout>
  </AsideProvider>
}
