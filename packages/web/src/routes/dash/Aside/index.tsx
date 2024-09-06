import {
  Routes,
  Route
} from 'react-router-dom'
import Vault from './Vault'
import Strategy from './Strategy'
import Yhaas from './Yhaas'
import Account from './Account'
import { Suspense } from 'react'

const SkeletonLoaderShimmer = () => (
  <div className="flex flex-col items-center justify-center gap-4 w-full">
    <div className="h-8 rounded w-3/4 shimmer"></div>
    <div className="h-8 rounded w-5/6 shimmer"></div>
    <div className="h-8 rounded w-2/3 shimmer"></div>
  </div>
)

export default function Aside() {
  return <div className="flex flex-col items-center justify-center gap-12">
    <Suspense fallback={<SkeletonLoaderShimmer />}>
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/strategy/:chainId/:address" element={<Strategy />} />
        <Route path="/vault/:chainId/:address" element={<Vault />} />
        <Route path="/yhaas" element={<Yhaas />} />
      </Routes>
    </Suspense>
  </div>
}
