import { create } from 'zustand'

interface Options {
  theme: 'default' | 'warn',
  setTheme: (theme: 'default' | 'warn') => void
}

export const useMenuBar = create<Options>((set) => ({
  theme: 'default',
  setTheme: (theme: 'default' | 'warn') => set({ theme })
}))
