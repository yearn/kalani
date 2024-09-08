import {
  Routes,
  Route
} from 'react-router-dom'
import Vault from './Vault'
import Strategy from './Strategy'
import Yhaas from './Yhaas'
import Account from './Account'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'

export default function Aside() {
  return <div className="flex flex-col items-center justify-center gap-12">
    <Suspense fallback={<Skeleton className="w-full h-48 rounded-primary" />}>
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/strategy/:chainId/:address" element={<Strategy />} />
        <Route path="/vault/:chainId/:address" element={<Vault />} />
        <Route path="/yhaas" element={<Yhaas />} />
      </Routes>
    </Suspense>
  </div>
}
