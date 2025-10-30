import FlyInFromBottom from '../../../../components/motion/FlyInFromBottom'
import { useMounted } from '../../../../hooks/useMounted'
import Allocator from './Allocator'
import Strategies from './Strategies'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Vitals from './Vitals'
import Fees from './Fees'

function useTabName() {
  const location = useLocation()
  return useMemo(() => location.search.replace('?', ''), [location])
}

function tabToContentKey(tab: string) {
  switch(tab) {
    case 'allocator': return 'allocator'
    case 'strategies': return 'strategies'
    case 'fees': return 'fees'
    default: return 'zap'
  }
}

function useTabAsideContent() {
  const tab = useTabName()
  return useMemo(() => {
    switch(tab) {
      case 'allocator': return <Allocator />
      case 'strategies': return <Strategies />
      case 'fees': return <Fees />
      default: return <Vitals />
    }
  }, [tab])
}

export default function Vault() {
  const tab = useTabName()
  const mounted = useMounted()
  const contentKey = tabToContentKey(tab)
  const content = useTabAsideContent()
  return <div className="w-full">
    <FlyInFromBottom _key={contentKey} parentMounted={mounted} exit={1}>
      {content}
    </FlyInFromBottom>
  </div>
}
