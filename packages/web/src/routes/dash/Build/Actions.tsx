import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import Button from '../../../components/elements/Button'
import { useVaultFormData, useVaultFormValidation } from './useVaultForm'
import { useVaultFactory } from './useVaultFactory'
import Dialog, { useDialog } from '../../../components/Dialog'
import { parseEventLogs, zeroAddress } from 'viem'
import abis from '@kalani/lib/abis'
import EvmAddressLink from '../../../components/EvmAddressLink'
import FlyInFromBottom from '../../../components/motion/FlyInFromBottom'

function IndexDialog() {
  const { chainId } = useAccount()
  const { newAddress } = useVaultFormData()
  const { signMessageAsync } = useSignMessage()
  const indexOnDemandDialog = useDialog('index-on-demand')
  const [indexing, setIndexing] = useState(false)

  const onIndex = useCallback(async () => {
    try {
      const signature = await signMessageAsync({ message: `Please index this vault,\n${'0x'}` })
      console.log(signature)
      setIndexing(true)
    } catch (error) {
      console.error(error)
    }
  }, [signMessageAsync, setIndexing])

  return <Dialog title="Your vault is ready!" dialogId="index-on-demand" fireworks={true}>
    {!indexing && <FlyInFromBottom _key="index-on-demand-info" className="flex flex-col gap-12">
      <p>
        Your new vault is available onchain here, <EvmAddressLink chainId={chainId ?? 1} address={newAddress ?? zeroAddress} />
      </p>
      <p>
        But before we can acccess your new vault in Kalani it has to be indexed.
      </p>
      <p>
        Index your new vault?
      </p>
      <div className="flex justify-end gap-4">
        <Button h={'secondary'} onClick={indexOnDemandDialog.closeDialog}>Cancel</Button>
        <Button onClick={onIndex}>Index</Button>
      </div>
    </FlyInFromBottom>}
    {indexing && <FlyInFromBottom _key="index-on-demand" className="flex flex-col gap-12">
      <p>
        Coming soon...
      </p>
      <p>
        On demand indexing is still in development.
      </p>
      <div className="flex justify-end gap-4">
        <Button onClick={indexOnDemandDialog.closeDialog}>Ok</Button>
      </div>
    </FlyInFromBottom>}
  </Dialog>
}

export default function Actions() {
  const { newAddress, setNewAddress, reset } = useVaultFormData()
  const { isFormValid } = useVaultFormValidation()
  const indexOnDemandDialog = useDialog('index-on-demand')
  const { simulation, write, confirmation, resolveToast } = useVaultFactory()

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
      const logs = parseEventLogs({ abi: abis.vaultFactory, eventName: 'NewVault', logs: confirmation.data.logs })
      setNewAddress(logs[0].args.vault_address)
      indexOnDemandDialog.openDialog()
    }
  }, [newAddress, confirmation, resolveToast, indexOnDemandDialog, setNewAddress])

  return <div className="relative mt-8 flex items-center justify-end gap-6">
    <Button onClick={reset} h={'secondary'}>Reset</Button>
    <Button onClick={onCreate} theme={buttonTheme} disabled={disabled}>Create Vault</Button>
    {simulation.isError && <div className="absolute right-0 -bottom-8 text-error-400">
      Vault factory is returning an error, see console
    </div>}
    <IndexDialog />
  </div>
}
