import { useConfig } from 'wagmi'
import { PiReceipt } from 'react-icons/pi'
import A from '@/components/elements/A'

export default function ExploreHash({ hash, message }: { hash: `0x${string}`, message: string }) {
  const config = useConfig()
  return <A href={`${config.getClient().chain.blockExplorers?.default.url}/tx/${hash}`} 
    target='_blank' 
    rel="noreferrer"
    className="inline">
    <div className="flex items-center gap-2">
      <PiReceipt />
      <div>{message}</div>
    </div>
  </A>
}
