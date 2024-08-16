'use client'

import { zeroAddress } from 'viem'
import Account from './[address]/Account'
import { useAccount } from 'wagmi'

export default function Page() {
  const { address } = useAccount()
  if (address) return <Account address={address ?? zeroAddress} />
}
