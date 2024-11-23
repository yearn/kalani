import FlyInFromBottom from '../../../../components/motion/FlyInFromBottom'
import { useMounted } from '../../../../hooks/useMounted'
import Allocator from './Allocator'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Vitals from './Vitals'

function useTabName() {
  const location = useLocation()
  return useMemo(() => location.search.replace('?', ''), [location])
}

function useTabAsideContent() {
  const tab = useTabName()
  return useMemo(() => {
    switch(tab) {
      case 'allocator-mock': return <></>
      case 'allocator': return <Allocator />
      default: return <Vitals />
    }
  }, [tab])
}

export default function Vault() {
  const tab = useTabName()
  const mounted = useMounted()
  const content = useTabAsideContent()
  return <div>
    <FlyInFromBottom _key={tab} parentMounted={mounted} exit={1}>
      {content}
    </FlyInFromBottom>
  </div>
}
