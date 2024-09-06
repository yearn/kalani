import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { useWhitelist } from '../provider'
import { useTargetType } from '../useTargetType'
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
  const { targetOrUndefined: target } = useWhitelist()
  const { data: targetType } = useTargetType(target)
  if (targetType === undefined) return <></>
  const Form = FORMS[targetType]
  return <FlyInFromBottom _key="target-form">
    <Form />
  </FlyInFromBottom>
}
