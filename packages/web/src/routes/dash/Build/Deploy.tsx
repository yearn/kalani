import { useCallback, useEffect, useMemo } from 'react'
import Button from '../../../components/elements/Button'
import { useVaultFormData, useVaultFormValidation } from './useVaultForm'
import { parseEventLogs } from 'viem'
import abis from '@kalani/lib/abis'
import { useNewVault } from './useNewVault'
import Reset from './Reset'
import { useAccount } from 'wagmi'

export default function Deploy() {
  const { chainId } = useAccount()
  const { newAddress, setNewAddress, setAccounts, setInceptBlock, setInceptTime } = useVaultFormData()
  const { isFormValid, isDeployed } = useVaultFormValidation()
  const { simulation, write, confirmation, resolveToast } = useNewVault()

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
    || isDeployed
  }, [isFormValid, simulation, write, confirmation, newAddress, isDeployed])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

  const onDeploy = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (!newAddress && confirmation.isSuccess) {
      resolveToast()
      const [newVaultLog] = parseEventLogs({ abi: abis.vaultFactory, eventName: 'NewVault', logs: confirmation.data.logs })
      const roles = parseEventLogs({ abi: abis.vault, eventName: 'RoleSet', logs: confirmation.data.logs })
      setAccounts(roles.map(log => ({
        chainId: chainId!,
        address: log.args.account,
        roleMask: log.args.role,
        vault: newVaultLog.args.vault_address
      })))
      setNewAddress(newVaultLog.args.vault_address)
      setInceptBlock(newVaultLog.blockNumber)
      setInceptTime(Math.floor(Date.now() / 1000))
    }
  }, [chainId, newAddress, confirmation, resolveToast, setNewAddress, setAccounts, setInceptBlock, setInceptTime])

  return <div className="relative mt-8 flex items-center justify-end gap-6">
    <Reset className={isDeployed ? 'hidden' : ''} />
    <Button onClick={onDeploy} theme={buttonTheme} disabled={disabled}>Deploy vault</Button>
    {simulation.isError && <div className="absolute right-0 -bottom-8 text-error-400">
      Role manager is returning an error, see console
    </div>}
  </div>
}
