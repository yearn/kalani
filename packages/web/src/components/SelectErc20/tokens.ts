import { Erc20 } from '@kalani/lib/types'

export const TOKENS: Record<number, Erc20[]> = {
  [1]: [
    { chainId: 1, address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai', symbol: 'DAI', decimals: 18 },
    { chainId: 1, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USDC', symbol: 'USDC', decimals: 6 },
    { chainId: 1, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD', symbol: 'USDT', decimals: 18 },
    { chainId: 1, address: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E', name: 'Curve USD', symbol: 'crvYSD', decimals: 18 },
    { chainId: 1, address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 18 },
    { chainId: 1, address: '0x06325440D014e39736583c165C2963BA99fAf14E', name: 'Curve.fi ETH/stETH', symbol: 'steCRV', decimals: 18 },
    { chainId: 1, address: '0x04C154b66CB340F3Ae24111CC767e0184Ed00Cc6', name: 'Pirex ETH', symbol: 'pxETH', decimals: 18 },
    { chainId: 1, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'Wrapped ETH', symbol: 'WETH', decimals: 18 }
  ],
  [100]: [
    { chainId: 100, address: '0xcB444e90D8198415266c6a2724b7900fb12FC56E', name: 'Monerium EUR emoney', symbol: 'EURe', decimals: 18 }
  ],
  [137]: [
    { chainId: 137, address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', name: 'Dai', symbol: 'DAI', decimals: 18 },
    { chainId: 137, address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', name: 'USDC', symbol: 'USDC', decimals: 6 },
    { chainId: 137, address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', name: 'Tether USD', symbol: 'USDT', decimals: 18 }
  ],
  [146]: [
    { chainId: 146, address: '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38', name: 'Wrapped Sonic', symbol: 'wS', decimals: 18 },
    { chainId: 146, address: '0x50c42dEAcD8Fc9773493ED674b675bE577f2634b', name: 'Wrapper ETH', symbol: 'WETH', decimals: 18 },
    { chainId: 146, address: '0x29219dd400f2Bf60E5a23d13Be72B486D4038894', name: 'Bridged USDC', symbol: 'USDC.e', decimals: 6 }
  ],
  [8453]: [
    { chainId: 8453, address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    { chainId: 8453, address: '0x4200000000000000000000000000000000000006', name: 'Wrapped ETH', symbol: 'WETH', decimals: 18 },
    { chainId: 8453, address: '0x820C137fa70C8691f0e44Dc420a5e53c168921Dc', name: 'USDS Stablecoin', symbol: 'USDS', decimals: 18 }
  ],
  [34443]: [
    { chainId: 34443, address: '0x4200000000000000000000000000000000000006', name: 'Wrapper ETH', symbol: 'WETH', decimals: 18 },
    { chainId: 34443, address: '0xd988097fb8612cc24eeC14542bC03424c656005f', name: 'USDC', symbol: 'USDC', decimals: 6 }
  ],
  [42161]: [
    { chainId: 42161, address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', name: 'Dai', symbol: 'DAI', decimals: 18 },
    { chainId: 42161, address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USDC', symbol: 'USDC', decimals: 6 }
  ],
  [80094]: [
    { chainId: 80094, address: '0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34', name: 'USDe', symbol: 'USDe', decimals: 6 },
    { chainId: 80094, address: '0x7DCC39B4d1C53CB31e1aBc0e358b43987FEF80f7', name: 'Wrapped eETH', symbol: 'weETH', decimals: 18 },
    { chainId: 80094, address: '0xecAc9C5F704e954931349Da37F60E39f515c11c1', name: 'Lombard Staked BTC', symbol: 'LBTC', decimals: 8 },
  ]
}
