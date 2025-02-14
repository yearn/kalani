import { useAccount } from 'wagmi'
import Drawer from '../../dash/Drawer'
import Header from '../../dash/Header'
import Account from '../../dash/Account/Account'
import { zeroAddress } from 'viem'
import MenuBar from '../../../components/MenuBar'

export default function Wallet() {
  const { address } = useAccount()

  return <div className={`
    w-full min-h-screen sm:max-h-auto
    flex sm:block flex-col justify-between`}>
    <Header className="hidden sm:block fixed z-50 inset-x-0 top-0 w-full" />
    <Drawer className="hidden sm:flex fixed z-50 top-0 left-0 w-24 h-screen" />

    <div className="grow sm:grow-0 flex items-start">
      <div className="hidden sm:block min-w-24"></div>

      <div className={`
        isolate grow w-full sm:min-h-screen
        sm:flex sm:flex-col sm:justify-start sm:border-r-primary sm:border-r-neutral-900`}>
        <div className="hidden sm:block w-full h-[5.1rem] border-b border-transparent"></div>
        <Account address={address ?? zeroAddress} />
      </div>

      <div className="w-aside px-8 pt-8 pb-24">
        <div className="w-aside"></div>
      </div>
      <aside className={`fixed right-0 hidden sm:block 
        w-aside min-h-screen mt-[5.1rem] px-8 pt-8 pb-24`}>
        <div className="w-full flex flex-col gap-6">

        </div>
      </aside>
    </div>

    <MenuBar className="justify-end" />
  </div>
}
