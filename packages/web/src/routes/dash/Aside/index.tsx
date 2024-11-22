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
import Project from './Project'

export default function Aside() {
  return <div className="flex flex-col items-center justify-center gap-12">
    <Suspense fallback={<Skeleton className="absolute top-0 left-0 w-full h-48" />}>
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/project/:chainId/:id" element={<Project />} />
        <Route path="/strategy/:chainId/:address" element={<Strategy />} />
        <Route path="/vault/:chainId/:address" element={<Vault />} />
        <Route path="/yhaas" element={<Yhaas />} />
      </Routes>
    </Suspense>
  </div>
}
