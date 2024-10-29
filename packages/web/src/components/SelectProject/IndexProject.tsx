import { HexString } from '@kalani/lib/types'
import Button from '../elements/Button'
import { fHexString } from '@kalani/lib/format'
import { useIndexProject } from './useIndexProject'
import { useCallback, useMemo } from 'react'
import { cn } from '../../lib/shadcn'
import { zeroAddress } from 'viem'
import { ROLE_MANAGER_FACTORY } from '@kalani/lib/addresses'
import { useDialog } from '../Dialog'
import { useSelectedProject } from '.'
import { useProjectsNonce } from './useProjects'

export default function IndexProject({ 
  chainId,
  projectId, 
  name,
  governance
}: { 
  chainId: number | undefined,
  projectId: HexString | undefined,
  name: string,
  governance: string | undefined
}) {
  const indexProject = useIndexProject(chainId, projectId)
  const nextProjectNonce = useProjectsNonce(state => state.next)
  const { setSelectedProject } = useSelectedProject()
  const { closeDialog } = useDialog('new-project')
  const isPending = useMemo(() => indexProject.state?.status === 'pending', [indexProject])
  const theme = useMemo(() => isPending ? 'theme-confirm' : 'theme-default', [isPending])
  const label = useMemo(() => isPending ? 'Indexing...' : 'OK', [isPending])

  const onClick = useCallback(() => {
    nextProjectNonce()
    setSelectedProject({
      chainId: chainId!, id: projectId!, name,
      roleManager: zeroAddress,
      registry: zeroAddress,
      accountant: zeroAddress,
      debtAllocator: zeroAddress,
      roleManagerFactory: ROLE_MANAGER_FACTORY
    })
    closeDialog()
  }, [nextProjectNonce, setSelectedProject, chainId, projectId, name, closeDialog])

  return <div className="relative w-full h-full flex flex-col gap-6">
    <div className={cn('grow rounded-primary flex flex-col gap-2 p-4 text-lg', theme)}>
      <div>Name: {name}</div>
      <div>Governance: {fHexString(governance ?? '0x')}</div>
      <div>Id: {fHexString(projectId ?? '0x')}</div>
    </div>
    <div className="flex items-center justify-end gap-3">
      <Button onClick={onClick} className={theme} disabled={isPending}>{label}</Button>
    </div>
  </div>
}
