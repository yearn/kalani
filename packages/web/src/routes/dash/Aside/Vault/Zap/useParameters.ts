import { create } from 'zustand'
import { Token } from '../../../../../hooks/useBalances'
import { useVaultFromParams, useVaultParams } from '../../../../../hooks/useVault'
import { useEffect } from 'react'

interface ZapParameters {
  inputToken: Token | undefined
  setInputToken: (token: Token) => void
  inputAmount: string
  setInputAmount: (amount: string) => void
  outputToken: Token | undefined
  setOutputToken: (token: Token) => void
  outputAmount: string 
  setOutputAmount: (amount: string) => void
}

const _useParameters = create<ZapParameters>((set) => ({
  inputToken: undefined,
  setInputToken: (token) => set({ inputToken: token }),
  inputAmount: '',
  setInputAmount: (amount) => set({ inputAmount: amount }),
  outputToken: undefined,
  setOutputToken: (token) => set({ outputToken: token }),
  outputAmount: '',
  setOutputAmount: (amount) => set({ outputAmount: amount })
}))

export const useParameters = () => {
  const { vault } = useVaultFromParams()
  const { inputToken, setInputToken, inputAmount, setInputAmount, outputToken, setOutputToken, outputAmount, setOutputAmount } = _useParameters()

  useEffect(() => {
    if (vault && inputToken === undefined) {
      setInputToken({chainId: vault.chainId, ...vault.asset})
    }
  }, [vault, inputToken, setInputToken])

  return { inputToken, setInputToken, inputAmount, setInputAmount, outputToken, setOutputToken, outputAmount, setOutputAmount }
}