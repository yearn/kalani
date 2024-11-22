import { useCallback, useMemo } from 'react'
import { IconType } from 'react-icons/lib'
import Button from '../../../components/elements/Button'
import useLocalStorage from 'use-local-storage'

export default function Notification({
  id, icon: Icon, authorized, onFix, children
}: {
  id: string, icon: IconType, authorized: boolean, onFix?: () => void, children?: React.ReactNode
}) {
  const [dismissed, setDismissed] = useLocalStorage<Record<string, boolean>>('notification-dismissed', {})

  const onDismiss = useCallback(() => {
    setDismissed(current => ({ ...current, [id]: true }))
  }, [id, setDismissed])

  const isDismissed = useMemo(() => dismissed[id], [id, dismissed])

  if (!authorized || isDismissed) { return <></> }

  return <div className={`pl-8 pr-3 pt-8 pb-3 flex flex-col gap-8 border-primary border-warn-950 rounded-primary text-warn-400`}>
    <div className="flex items-center gap-8">
      <Icon size={32} className="group-data-[open=true]:fill-secondary-100 group-data-[open=false]:fill-warn-400" />
      {children}
    </div>
    <div className="flex justify-end gap-4 text-xs 2xl:text-md">
      <Button h="tertiary" className="py-4 text-warn-400 text-base" onClick={onDismiss}>Dismiss</Button>
      <Button h="primary" className="py-4 text-warn-400 text-base" onClick={onFix}>Fix</Button>
    </div>
  </div>
}
