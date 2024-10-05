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
        isolate grow w-full sm:min-h-screen
        sm:flex sm:flex-col sm:justify-start sm:border-r sm:border-r-primary-1000`}>
        <div className="hidden sm:block w-full h-20 border-b border-transparent"></div>
        <Outlet />
      </div>

      <aside className={`hidden sm:block min-w-[26%] px-8 pt-28 pb-12 h-screen`}>
        <div className="max-w-[380px]">
          <Aside />
        </div>
      </aside>
    </div>

    <MenuBar className="justify-end" />
  </div>
}
