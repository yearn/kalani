import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import { useAccount } from 'wagmi'
import Lander from './routes/lander'
import DashLayout from './routes/dash/layout'
import Vault from './routes/dash/Vault'
import Strategy from './routes/dash/Strategy'
import Account from './routes/dash/Account'
import Accountant from './routes/dash/Accountant'
import Erc4626 from './routes/dash/Erc4626'
import Yhaas from './routes/dash/Yhaas'
import Eg from './routes/_eg'
import Explore from './routes/dash/Explore'
import Build from './routes/dash/Build'
import Home from './routes/home'
import { useMounted } from './hooks/useMounted'
import { useMemo } from 'react'

export default function App() {
  const mounted = useMounted()
  const { isConnected } = useAccount()

  const lander = useMemo(() => {
    if (!mounted) return <></>
    return isConnected ? <Home /> : <Lander />
  }, [mounted, isConnected])

  return <div className="w-full min-h-screen flex items-center justify-center">
    <Router>
      <Routes>
        <Route index element={lander} />
        <Route path="home" element={lander} />
        <Route path="explore" element={<Explore />} />
        <Route path="/*" element={<DashLayout />}>
          <Route path="account/:address" element={<Account />} />
          <Route path="accountant/:chainId/:address" element={<Accountant />} />
          <Route path="build" element={<Build />} />
          <Route path="erc4626/:chainId/:address" element={<Erc4626 />} />
          <Route path="strategy/:chainId/:address" element={<Strategy />} />
          <Route path="vault/:chainId/:address" element={<Vault />} />
          <Route path="yhaas" element={<Yhaas />} />
        </Route>
        <Route path="_eg" element={<Eg />} />
      </Routes>
    </Router>
  </div>
}
