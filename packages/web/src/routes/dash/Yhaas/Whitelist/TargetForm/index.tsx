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
  if (targetInfos.length === 0 || targetInfos.some(info => info.targetType === undefined)) return <></>
  const Form = FORMS[targetInfos[0].targetType!]
  return <FlyInFromBottom _key="target-form">
    <Form />
  </FlyInFromBottom>
}
