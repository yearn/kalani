import { useCallback, useEffect, useMemo } from 'react'
import { useSignMessage } from 'wagmi'
import Button from '../../../components/elements/Button'
import { useVaultFormData, useVaultFormValidation } from './useVaultForm'
import { useVaultFactory } from './useVaultFactory'

export default function Actions() {
  const { reset } = useVaultFormData()
  const { isFormValid } = useVaultFormValidation()
  const { signMessageAsync } = useSignMessage()

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
  }, [isFormValid, simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

  const onCreate = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) { resolveToast() }
  }, [confirmation, resolveToast])

  const onIndex = useCallback(async () => {
    try {
      const signature = await signMessageAsync({ message: `Please index this vault,\n${'0x'}` })
      console.log(signature)
    } catch (error) {
      console.error(error)
    }
  }, [signMessageAsync])

  return <div className="relative mt-8 flex items-center justify-end gap-6">
    <Button onClick={reset} h={'secondary'}>Reset</Button>
    <Button onClick={onCreate} theme={buttonTheme} disabled={disabled}>Create Vault</Button>
    {simulation.isError && <div className="absolute right-0 -bottom-8 text-error-400">
      Vault factory is returning an error, see console
    </div>}
    <Button onClick={onIndex} theme={buttonTheme} disabled={disabled} className="hidden">Index Vault</Button>
  </div>
}
