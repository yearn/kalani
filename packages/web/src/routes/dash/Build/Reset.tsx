import Button, { ButtonProps } from '../../../components/elements/Button'
import { useReset } from './useReset'

export default function Reset(props: ButtonProps) {
  const reset = useReset()
  return <Button {...props} onClick={reset} h={'secondary'}>Reset</Button>
}
