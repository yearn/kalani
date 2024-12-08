import { zeroAddress } from 'viem'
import { useVaultFormData } from './useVaultForm'
import { useVaultSnapshot } from '../../../hooks/useVaultSnapshot'
import Reset, { useReset } from './Reset'
import Button from '../../../components/elements/Button'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonButton } from '../../../components/Skeleton'
import { useNameRecommendations } from './useNameRecommendations'
import { useLocalVaults } from '../../../hooks/useVault'
import { useSelectedProject } from '../../../components/SelectProject'
import { useProjectSnapshot } from '../../../hooks/useProjectSnapshot'
import { useAccountantSnapshot } from '../../../hooks/useAccountantSnapshot'

export function CompleteSkeleton() {
  const recommendations = useNameRecommendations()
  return <div className="relative mt-8 flex flex-col items-end gap-3">
    <p className="text-2xl">Your vault is ready!</p>
    <div className="relative mt-8 flex items-center justify-end gap-6">
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
  const { setLocalVaults } = useLocalVaults()

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
    address: projectSnapshot.accountant
  })

  const onOk = useCallback(async () => {
    await setLocalVaults(vaults => [
      ...vaults, 
      {
        ...vaultSnapshot,
        ...projectSnapshot,
        fees: {
          managementFee: accountantSnapshot.defaultConfig.managementFee,
          performanceFee: accountantSnapshot.defaultConfig.performanceFee
        }
      }
    ])
    navigate(`/vault/${vaultSnapshot.chainId}/${vaultSnapshot.address}?allocator`, { replace: true })
    reset()
  }, [setLocalVaults, navigate, vaultSnapshot, projectSnapshot, reset])

  return <div className="relative mt-8 flex flex-col items-end gap-3">
    <p className="text-2xl">Your vault is ready!</p>
    <div className="relative mt-8 flex items-center justify-end gap-6">
      <Reset />
      <Button onClick={onOk}>{`${vaultSnapshot.name} ->`}</Button>
    </div>
  </div>
}
