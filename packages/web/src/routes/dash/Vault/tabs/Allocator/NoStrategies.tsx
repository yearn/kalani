import AButton from '../../../../../components/elements/AButton'
import { useBreakpoints } from '../../../../../hooks/useBreakpoints'
import { useHashNav } from '../../../../../hooks/useHashNav'

export default function NoStrategies() {
  const menu = useHashNav('menu')
  const { sm } = useBreakpoints()

  return <div className={`
    flex items-center justify-center 
    text-xl text-neutral-600`}>
    No strategies yet{!sm && <>... <AButton onClick={menu.open}>add some!</AButton></>}
  </div>
}
