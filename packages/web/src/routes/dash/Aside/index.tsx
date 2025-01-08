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
import Build from './Build'
import Explore from './Explore'

function AsideSkeleton() {
  return <Skeleton className="w-full h-48 rounded-primary" />
}

export default function Aside() {
  return <div className="flex flex-col items-center justify-center gap-12">
    <Suspense fallback={<AsideSkeleton />}>
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/build" element={<Build />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/project/:chainId/:id" element={<Project />} />
        <Route path="/strategy/:chainId/:address" element={<Strategy />} />
        <Route path="/vault/:chainId/:address" element={<Vault />} />
        <Route path="/yhaas" element={<Yhaas />} />
      </Routes>
    </Suspense>
  </div>
}
