import { Outlet } from 'react-router-dom'
import Header from './Header'
import Drawer from './Drawer'
import Aside from './Aside'

export default function Layout() {
  return <div className="w-full min-h-screen">
    <Header className="sticky z-50 inset-x-0 top-0 w-full" />
    <Drawer className="fixed z-50 top-0 left-0 w-24 h-screen" />

    <div className="flex items-start">
      <div className="min-w-24"></div>

      <div className="isolate grow min-w-[800px] min-h-screen flex justify-end py-12 border-r border-r-primary-1000">
        <Outlet />
      </div>

      <aside className={`min-w-[26%] px-8 py-12 h-screen`}>
        <div className="max-w-[380px]">
          <Aside />
        </div>
      </aside>
    </div>
  </div>
}
