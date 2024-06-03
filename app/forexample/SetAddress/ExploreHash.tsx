import { useConfig } from 'wagmi'
import { TfiReceipt } from 'react-icons/tfi'
import A from '@/components/elements/A'

export default function ExploreHash({ hash, message }: { hash: `0x${string}`, message: string }) {
  const config = useConfig()
  return <A href={`${config.getClient().chain.blockExplorers?.default.url}/tx/${hash}`} 
    target='_blank' 
    rel="noreferrer"
    className="inline">
    <div className="flex items-center gap-2">
      <TfiReceipt />
      <div>{message}</div>
    </div>
  </A>
}
