import React, { useMemo } from 'react'
import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { useWhitelist } from '../provider'
import { useTargetInfos } from '../useTargetInfos'
import StrategyForm from './StrategyForm'
import VaultForm from './VaultForm'

const FORMS: {
  [key: string]: React.ComponentType
} = {
  'strategy': StrategyForm,
  'vault': VaultForm
}

export default function TargetForm() {
  const { targets } = useWhitelist()
  const { targetInfos } = useTargetInfos(targets)
  
  const { Form, allSameTargetType, moreThanOneVault } = useMemo(() => {
    if (targetInfos.length === 0 || targetInfos.some(info => info.targetType === undefined)) {
      return { Form: null, allSameTargetType: false, moreThanOneVault: false }
    }

    const Form = FORMS[targetInfos[0].targetType!]
    const allSameTargetType = targetInfos.every(info => info.targetType === targetInfos[0].targetType)
    const moreThanOneVault = targetInfos.filter(info => info.targetType === 'vault').length > 1

    return { Form, allSameTargetType, moreThanOneVault }
  }, [targetInfos])

  if (!Form) return <></>

  if (!allSameTargetType) {
    return <div className="text-error-500 text-right">Error, Mixed targets not supported</div>
  }

  if (moreThanOneVault) {
    return <div className="text-error-500 text-right">Error, vaults must be whitelisted one at a time</div>
  }

  return <FlyInFromBottom _key="target-form">
    <Form />
  </FlyInFromBottom>
}
