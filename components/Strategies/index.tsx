import { useUser } from '@/hooks/useUser'
import Strategy from './Strategy'

export default function Strategies() {
  const { strategies } = useUser()
  return <div className="w-full flex flex-col gap-4">
    {strategies && strategies.map((strategy, i) => <Strategy key={i} strategy={strategy} />)}
  </div>
}
