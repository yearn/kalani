import accountant from './accountant'
import addressProvider from './addressProvider'
import allocator from './allocator'
import allocatorFactory from './allocatorFactory'
import strategy from './strategy'
import vault from './vault'
import vaultFactory from './vaultFactory'
import roleManager from './roleManager'
import roleManagerFactory from './roleManagerFactory'
import registry from './registry'

const abis = { 
  accountant, 
  addressProvider,
  allocator,
  allocatorFactory,
  roleManager,
  roleManagerFactory,
  registry,
  strategy,
  vault,
  vaultFactory
}

export default abis
