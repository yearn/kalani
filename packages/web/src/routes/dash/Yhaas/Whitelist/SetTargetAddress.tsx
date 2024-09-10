import { useCallback } from 'react'
import { useWhitelist } from './provider'
import Addresses from '../../../../components/elements/Addresses'
import { EvmAddress } from '@kalani/lib/types'

export default function SetTargetAddress() {
  const { targets, setTargets, setFrequency } = useWhitelist()

  const onChange = useCallback((addresses: EvmAddress[], isValid: boolean) => {
    if (isValid) {
      setTargets(addresses)
      setFrequency(3)
    }
  }, [setTargets, setFrequency])

  return <Addresses onChange={onChange} initialAddresses={targets} />
}
