import { Suspense, useMemo } from 'react'
import Skeleton from '../../../../components/Skeleton'
import { useProjectByParams } from '../useProjectByParams'
import { useAccount } from 'wagmi'
import { ListItem } from '../../Explore/ListItem'
import { useAccountItems } from '../../Account/useAccountItems'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { zeroAddress } from 'viem'

function Suspender() {
  const { project } = useProjectByParams()
  const { address } = useAccount()
  const { items, findRoleForItem } = useAccountItems(address ?? zeroAddress)

  const projectItems = useMemo(() => {
    return items.filter(item => item.projectId === project.id)
  }, [items, project])

  return <div className="p-3 flex flex-col gap-3">
    {projectItems?.map(item => <ListItem 
      key={`${item.chainId}-${item.address}`} 
      item={item} roleMask={findRoleForItem(item)?.roleMask} 
      isRoleManager={compareEvmAddresses(item.roleManager ?? zeroAddress, address)} 
    />)}
  </div>
}

function _Skeleton() {
  return <div className="p-3 flex flex-col gap-3">
    <Skeleton className="w-full h-32 rounded-primary" />
    <Skeleton className="w-full h-32 rounded-primary" />
    <Skeleton className="w-full h-32 rounded-primary" />
  </div>
}

export default function Vaults() {
  return <Suspense fallback={<_Skeleton />}>
    <Suspender />
  </Suspense>
}
