import { useAccount } from 'wagmi'
import { useMounted } from '../../hooks/useMounted'
import { useProjects } from '../../components/SelectProject/useProjects'
import { Suspense, useMemo } from 'react'
import Lander from './lander'
import Wallet from './wallet'
import Skeleton from '../../components/Skeleton'
import { useHashNav } from '../../hooks/useHashNav'

function Suspender() {
  const mounted = useMounted()
  const { isConnected, chainId, address } = useAccount()
  const { projects } = useProjects(chainId, address)
  const letsGo = useHashNav('lets-go')

  const lander = useMemo(() => {
    if (!mounted) return <></>
    if (letsGo.isOpen) return <Lander />
    return (isConnected && projects.length > 0) ? <Wallet /> : <Lander />
  }, [mounted, isConnected, projects, letsGo])

  return <div className="relative w-full min-h-screen flex flex-col sm:flex-row">
    {lander}
  </div>
}

export default function Root() {
  return <Suspense fallback={
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <Skeleton className="w-full min-h-screen rounded-primary" />
    </div>
  }>
    <Suspender />
  </Suspense>
}
