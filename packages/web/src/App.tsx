import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
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
import Root from './routes/root'
import Project from './routes/dash/Project'

export default function App() {
  return <div className="w-full min-h-screen flex items-center justify-center">
    <Router>
      <Routes>
        <Route index element={<Root />} />
        <Route path="home" element={<Root />} />
        <Route path="explore" element={<Explore />} />
        <Route path="/*" element={<DashLayout />}>
          <Route path="account/:address" element={<Account />} />
          <Route path="accountant/:chainId/:address" element={<Accountant />} />
          <Route path="build" element={<Build />} />
          <Route path="erc4626/:chainId/:address" element={<Erc4626 />} />
          <Route path="project/:chainId/:id" element={<Project />} />
          <Route path="strategy/:chainId/:address" element={<Strategy />} />
          <Route path="vault/:chainId/:address" element={<Vault />} />
          <Route path="yhaas" element={<Yhaas />} />
        </Route>
        <Route path="_eg" element={<Eg />} />
      </Routes>
    </Router>
  </div>
}
