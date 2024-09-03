import {
  Routes,
  Route
} from 'react-router-dom'
import Vault from './Vault'
import Strategy from './Strategy'
import Yhaas from './Yhaas'
import Account from './Account'

export default function Aside() {
  return <Routes>
    <Route path="/account" element={<Account />} />
    <Route path="/strategy/:chainId/:address" element={<Strategy />} />
    <Route path="/vault/:chainId/:address" element={<Vault />} />
    <Route path="/yhaas" element={<Yhaas />} />
  </Routes>
}
