import { Outlet } from 'react-router-dom'
import Header from './Header'
import Drawer from './Drawer'
import Aside from './Aside'
import MenuBar from '../../components/MenuBar'

export default function Layout() {
  return <div className={`
    w-full h-screen sm:max-h-auto
    flex sm:block flex-col justify-between`}>
    <Header className="hidden sm:block fixed z-50 inset-x-0 top-0 w-full" />
    <Drawer className="hidden sm:flex fixed z-50 top-0 left-0 w-24 h-screen" />

    <div className="grow sm:grow-0 flex items-start">
      <div className="hidden sm:block min-w-24"></div>

      <div className={`
        isolate grow overflow-y-auto pb-24 sm:min-h-screen
        sm:flex sm:flex-col sm:justify-start sm:border-r-primary sm:border-r-black`}>
        <div className="w-full h-[4.5rem] sm:h-[5.1rem] border-b border-transparent"></div>
        <Outlet />
      </div>

      <div className="hidden sm:block w-aside px-8 pt-8 pb-24">
        <div className="w-aside"></div>
      </div>

      <aside className={`hidden sm:block fixed right-0
        w-aside min-h-screen mt-[5.1rem] px-8 pt-8 pb-24`}>
        <Aside />
      </aside>
    </div>

    <MenuBar  />
  </div>
}
