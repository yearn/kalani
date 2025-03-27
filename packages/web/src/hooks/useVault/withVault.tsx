import { useVault, Vault } from '.'
import { useVaultParams } from '.'

export function useVaultFromParams() {
  const params = useVaultParams()
  return useVault(params)
}

export function withVault(WrappedComponent: React.ComponentType<{ vault: Vault }>) {
  return function ComponentWithVault(props: object) {
    const { vault } = useVaultFromParams()
    if (!vault) return <></>
    return <WrappedComponent vault={vault} {...props} />
  }
}
