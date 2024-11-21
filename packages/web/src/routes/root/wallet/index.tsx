import { useAccount } from 'wagmi'
import Drawer from '../../dash/Drawer'
import Header from '../../dash/Header'
import Account from '../../dash/Account/Account'
import { zeroAddress } from 'viem'
import MenuBar from '../../../components/MenuBar'
import { useProjects } from '../../../components/SelectProject/useProjects'
import LinkButton from '../../../components/elements/LinkButton'

export default function Wallet() {
  const { chainId, address } = useAccount()
  const { projects } = useProjects(chainId, address)

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
        <div className="hidden sm:block w-full h-20 border-b border-transparent"></div>
        <Account address={address ?? zeroAddress} />
      </div>

      <aside className={`relative hidden sm:block min-w-[26%] px-8 pt-28 h-screen`}>
        <div className="max-w-[380px] flex flex-col gap-6">
          <h2 className="text-neutral-400">Projects</h2>
          {projects.map(project => <LinkButton 
            key={project.id} 
            to={`/project/${project.chainId}/${project.id}`} 
            h="tertiary" 
            className="px-4 grow h-14 flex items-center justify-between"
          >
            {project.name}
          </LinkButton>)}
        </div>
      </aside>
    </div>

    <MenuBar className="justify-end" />
  </div>
}
