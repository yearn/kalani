import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'

export function useHasRevokeRole() {
  return useHasRolesOnChain(ROLES.REVOKE_STRATEGY_MANAGER)
}
