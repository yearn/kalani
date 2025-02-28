import { zeroAddress } from 'viem'
import { useVaultFormData } from './useVaultForm'
import { useVaultSnapshot } from '../../../hooks/useVaultSnapshot'
import Reset from './Reset'
import { useReset } from './useReset'
import Button from '../../../components/elements/Button'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonButton } from '../../../components/Skeleton'
import { useNameRecommendations } from './useNameRecommendations'
import { useLocalVaults } from '../../../hooks/useVault'
import { useSelectedProject } from '../../../components/SelectProject/useSelectedProject'
import { useProjectSnapshot } from '../../../hooks/useProjectSnapshot'
import { useAccountantSnapshot } from '../../../hooks/useAccountantSnapshot'
import { useBreakpoints } from '../../../hooks/useBreakpoints'
import { useScrollOnMount } from '../../../hooks/useScrollOnMount'

export function CompleteSkeleton() {
  const { sm } = useBreakpoints()
  const ref = useScrollOnMount(true, sm ? 120 : 0)
  const recommendations = useNameRecommendations()
  return <div ref={ref} className="relative mt-8 flex flex-col items-end gap-3">
    <p className="text-2xl">Your vault is ready!</p>
    <div className="relative mt-8 flex flex-wrap-reverse items-center justify-end gap-6">
      <SkeletonButton>Reset</SkeletonButton>
      <SkeletonButton>{`${recommendations.name} ->`}</SkeletonButton>
    </div>
  </div>
}

export default function Complete() {
  const { asset, newAddress, accounts, inceptBlock, inceptTime } = useVaultFormData()
  const { selectedProject } = useSelectedProject()
  const reset = useReset()
  const navigate = useNavigate()
  const { upsertLocalVault } = useLocalVaults()

  const { snapshot: vaultSnapshot } = useVaultSnapshot({ 
    address: newAddress ?? zeroAddress,
    asset,
    projectId: selectedProject?.id,
    projectName: selectedProject?.name,
    accounts,
    inceptBlock,
    inceptTime
  })

  const { snapshot: projectSnapshot } = useProjectSnapshot({
    projectId: selectedProject?.id ?? '0x0',
    projectName: selectedProject?.name ?? ''
  })

  const { snapshot: accountantSnapshot } = useAccountantSnapshot({
    address: projectSnapshot.accountant,
    vault: newAddress ?? zeroAddress
  })

  const onOk = useCallback(async () => {
    await upsertLocalVault({
      ...vaultSnapshot,
      ...projectSnapshot,
      fees: {
        managementFee: accountantSnapshot.feeConfig.managementFee,
        performanceFee: accountantSnapshot.feeConfig.performanceFee
      }
    })
    navigate(`/vault/${vaultSnapshot.chainId}/${vaultSnapshot.address}?allocator`, { replace: true })
    setTimeout(reset, 1000)
  }, [upsertLocalVault, navigate, vaultSnapshot, projectSnapshot, reset, accountantSnapshot])

  return <div className="relative mt-8 flex flex-col items-end gap-3">
    <p className="text-2xl">Your vault is ready!</p>
    <div className="relative mt-8 flex flex-wrap-reverse items-center justify-end gap-6">
      <Reset />
      <Button onClick={onOk}>{`${vaultSnapshot.name} ->`}</Button>
    </div>
  </div>
}
