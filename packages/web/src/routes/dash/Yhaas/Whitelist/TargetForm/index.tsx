import React, { useMemo } from 'react'
import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { useWhitelist } from '../provider'
import { useTargetInfos } from '../useTargetInfos'
import AllocatorForm from './AllocatorForm'
import StrategyForm from './StrategyForm'
import VaultForm from './VaultForm'

const FORMS: {
  [key: string]: React.ComponentType
} = {
  'allocator': AllocatorForm,
  'strategy': StrategyForm,
  'vault': VaultForm
}

export default function TargetForm() {
  const { targets } = useWhitelist()
  const { targetInfos } = useTargetInfos(targets)
  
  const { Form, allSameTargetType } = useMemo(() => {
    if (targetInfos.length === 0 || targetInfos.some(info => info.targetType === undefined)) {
      return { Form: null, allSameTargetType: false }
    }

    const Form = FORMS[targetInfos[0].targetType!]
    const allSameTargetType = targetInfos.every(info => info.targetType === targetInfos[0].targetType)

    return { Form, allSameTargetType }
  }, [targetInfos])

  if (!Form) return <></>

  if (!allSameTargetType) {
    return <div className="text-error-500 text-right">Error, Mixed targets not supported!</div>
  }

  return <FlyInFromBottom _key="target-form">
    <Form />
  </FlyInFromBottom>
}
