import { useCallback } from 'react'
import { useWhitelist } from './useWhitelist'
import Addresses from '../../../../../components/elements/Addresses'
import { EvmAddress } from '@kalani/lib/types'

export default function SetTargetAddresses() {
  const { targetsRaw, setTargetsRaw, setTargets, setFrequency } = useWhitelist()

  const onChange = useCallback((addresses: EvmAddress[], isValid: boolean) => {
    if (isValid) {
      setTargets(addresses)
      setFrequency(3)
    } else {
      setTargets([])
    }
  }, [setTargets, setFrequency])

  return <Addresses onChange={onChange} next={targetsRaw} setNext={setTargetsRaw} />
}
