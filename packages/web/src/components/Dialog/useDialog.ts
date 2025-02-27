import { useHashNav } from '../../hooks/useHashNav'

export function useDialog(dialogId: string) {
  const nav = useHashNav(dialogId)
  return { isOpen: nav.isOpen, openDialog: nav.open, closeDialog: nav.close }
}
