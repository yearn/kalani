import { useCallback, useEffect, useMemo } from 'react'
import { useAccount, useReadContract, useSignMessage } from 'wagmi'
import Button from '../../../components/elements/Button'
import { useVaultFormData, useVaultFormValidation } from './useVaultForm'
import Dialog, { useDialog } from '../../../components/Dialog'
import { parseEventLogs, zeroAddress } from 'viem'
import abis from '@kalani/lib/abis'
import { useNewVault } from './useNewVault'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import { fHexString } from '@kalani/lib/format'
import { useIndexVault } from './useIndexVault'
import { cn } from '../../../lib/shadcn'
import { useSelectedProject } from '../../../components/SelectProject'
import { useNavigate } from 'react-router-dom'

function useResetEverything() {
  const { reset } = useVaultFormData()
  const indexVault = useIndexVault()
  const newVault = useNewVault()
  const { setSelectedProject } = useSelectedProject()
  return useCallback(() => {
    indexVault.mutation.reset()
    newVault.write.reset()
    reset()
    setSelectedProject(undefined)
  }, [indexVault, newVault, reset, setSelectedProject])
}

function IndexDialog({
  blockNumber,
  timestamp
}: {
  blockNumber?: bigint,
  timestamp?: number
}) {
  const { chainId } = useAccount()
  const { asset, newAddress, category } = useVaultFormData()
  const indexVault = useIndexVault(chainId, newAddress)
  const isPending = useMemo(() => indexVault.state?.status === 'pending', [indexVault])
  const isSuccess = useMemo(() => indexVault.state?.status === 'success', [indexVault])
  const { selectedProject } = useSelectedProject()
  const navigate = useNavigate()
  const dialog = useDialog('index-on-demand')
  const resetEverything = useResetEverything()

  const { data: apiVersion } = useReadContract({
    abi: abis.vault, address: newAddress ?? zeroAddress, functionName: 'apiVersion'
  })

  const { signMessageAsync } = useSignMessage()

  const onIndex = useCallback(async () => {
    try {
      const signature = await signMessageAsync({ message: `Hi, please index my vault, ${newAddress}. Thank you!` })
      indexVault.mutation.mutate({
        asset: asset?.address,
        decimals: asset?.decimals,
        apiVersion,
        category,
        projectId: selectedProject?.id,
        projectName: selectedProject?.name,
        roleManager: selectedProject?.roleManager,
        inceptBlock: blockNumber, 
        inceptTime: timestamp,
        signature
      })
    } catch (error) {
      console.error(error)
    }
  }, [newAddress, indexVault, asset, apiVersion, selectedProject, blockNumber, timestamp])

  const onOk = useCallback(() => {
    navigate(`/vault/${chainId}/${newAddress}?allocator`, { replace: true })
    resetEverything()
  }, [navigate, chainId, newAddress, resetEverything])

  const onCancel = useCallback(() => {
    resetEverything()
    dialog.closeDialog()
  }, [resetEverything, dialog])

  const imperative = useMemo(() => {
    if (isSuccess) {
      return 'Your vault is indexed!'
    } else {
      return 'But before we can acccess your new vault in Kalani it must be indexed.'
    }
  }, [isSuccess])

  const buttonLabel = useMemo(() => {
    if (isSuccess) return 'Your vault ->'
    if (isPending) return 'Indexing...'
    return `Index ${fHexString(newAddress ?? zeroAddress)}`
  }, [isSuccess, isPending, newAddress])

  const theme = useMemo(() => {
    if (isPending) return 'confirm'
    return 'default'
  }, [isSuccess, isPending])

  return <Dialog title="Your vault is ready!" dialogId="index-on-demand" fireworks={true} className="relative">
    <div className={cn('flex flex-col gap-12')}>
      <div className={cn('flex flex-col gap-6', theme)}>
        <div>
          Your new vault is available onchain here, 
          <EvmAddressChipSlide chainId={chainId ?? 1} address={newAddress ?? zeroAddress} className="bg-neutral-600" />
        </div>
        <div>{imperative}</div>
      </div>
      <div className="flex justify-end gap-4">
        {!isSuccess && <Button onClick={onIndex} theme={theme} disabled={isPending}>{buttonLabel}</Button>}
        {isSuccess && <>
          <Button onClick={onCancel} h="secondary">Back</Button>
          <Button onClick={onOk}>{buttonLabel}</Button>
        </>}
      </div>
    </div>
  </Dialog>
}

export default function Actions() {
  const { newAddress, setNewAddress } = useVaultFormData()
  const { isFormValid } = useVaultFormValidation()
  const indexOnDemandDialog = useDialog('index-on-demand')
  const { simulation, write, confirmation, resolveToast } = useNewVault()
  const resetEverything = useResetEverything()

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !isFormValid
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
    || !!newAddress
  }, [isFormValid, simulation, write, confirmation, newAddress])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

  const onCreate = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (!newAddress && confirmation.isSuccess) {
      resolveToast()
      const [log] = parseEventLogs({ abi: abis.vaultFactory, eventName: 'NewVault', logs: confirmation.data.logs })
      setNewAddress(log.args.vault_address)
      indexOnDemandDialog.openDialog()
    }
  }, [newAddress, confirmation, resolveToast, indexOnDemandDialog, setNewAddress])

  return <div className="relative mt-8 flex items-center justify-end gap-6">
    <Button onClick={resetEverything} h={'secondary'}>Reset</Button>
    <Button onClick={onCreate} theme={buttonTheme} disabled={disabled}>Deploy Vault</Button>
    {simulation.isError && <div className="absolute right-0 -bottom-8 text-error-400">
      Role manager is returning an error, see console
    </div>}
    <IndexDialog blockNumber={confirmation.data?.blockNumber} timestamp={Math.floor(Date.now() / 1000)} />
  </div>
}
