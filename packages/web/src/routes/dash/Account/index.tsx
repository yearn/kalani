import { EvmAddress, EvmAddressSchema } from '../../../lib/types'
import { useParams } from 'react-router-dom'
import Account from './Account'

export default function Page({ address }: { address?: EvmAddress }) {
  const params = useParams()
  if (!(address ?? params.address)) return <></>
  const account = address ?? EvmAddressSchema.parse(params.address)
  return Account({ address: account })
}
