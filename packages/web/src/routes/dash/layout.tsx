import { Outlet } from 'react-router-dom'
import Header from './Header'
import Drawer from './Drawer'
import Aside from './Aside'
import MenuBar from '../../components/MenuBar'

export default function Layout() {
  return <div className="w-full min-h-screen">
    <Header className="hidden sm:block fixed z-50 inset-x-0 top-0 w-full" />
    <Drawer className="hidden sm:flex fixed z-50 top-0 left-0 w-24 h-screen" />

    <div className="grow sm:grow-0 flex items-start">
      <div className="hidden sm:block min-w-24"></div>

      <div className={`
        isolate grow sm:min-h-screen sm:h-full pb-24
        sm:flex sm:flex-col sm:justify-start
        border-r-primary border-r-neutral-900`}>
        <div className="hidden sm:block w-full h-[5.1rem] border-b border-transparent"></div>
        <Outlet />
      </div>

      <div className="min-w-[420px] max-w-[420px]"></div>
      <aside className={`fixed right-0 hidden sm:block 
        min-w-[420px] max-w-[420px] min-h-screen mt-[5.1rem] px-8 pt-8 pb-24`}>
        <Aside />
      </aside>
    </div>

    <MenuBar className="justify-end" />
  </div>
}
