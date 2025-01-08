import { useAccount } from 'wagmi'
import Button from '../../../../../components/elements/Button'
import TokenImg from '../../../../../components/TokenImg'
import { cn } from '../../../../../lib/shadcn'
import { useBalance } from './hooks/useBalance'
import { Input } from './InputPanel/Input'
import { useParameters } from './useParameters'
import { zeroAddress } from 'viem'
import { fTokens } from '@kalani/lib/format'

function SwitchOption({ selected, onClick, children }: { selected: boolean, onClick: () => void, children: React.ReactNode }) {
  return <div data-selected={selected} onClick={onClick} className={cn(`
    px-6 py-2 bg-transparent
    text-neutral-400 hover:text-neutral-50 active:text-neutral-400 
    data-[selected=true]:bg-secondary-400
    data-[selected=true]:text-neutral-900
    rounded-full cursor-pointer`)}>
    {children}
  </div>
}

function Switch({}: {}) {
  return <div className="w-min flex items-center gap-2 bg-black rounded-full">
    <SwitchOption selected={true} onClick={() => {}}>Deposit</SwitchOption>
    <SwitchOption selected={false} onClick={() => {}}>Withdraw</SwitchOption>
  </div>
}

function Chip({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn(`px-3 py-1 
    flex items-center gap-3 
    bg-neutral-900 border-primary border-neutral-900
    hover:text-secondary-50 hover:bg-neutral-900 hover:border-secondary-50
    active:text-secondary-400 active:border-secondary-400 active:bg-black
    saber-glow rounded-full cursor-pointer pointer-events-auto`, className)}>
    {children}
  </div>
}

function Balance() {
  const { chainId, address } = useAccount()
  const { inputToken } = useParameters()
  const { balance, decimals } = useBalance({ chainId, token: inputToken?.address ?? zeroAddress, address: address ?? zeroAddress })
  // const priced = fUSD(priced(balance ?? 0n, decimals ?? 18, price ?? 0))
  return <div>Balance {fTokens(balance ?? 0n, decimals ?? 18)}</div>
}

function Deposit() {
  return <div className="flex flex-col gap-3 rounded-primary">

    <div className={`relative h-24 px-4 flex items-center  
      border-primary border-neutral-800
      hover:text-secondary-50 hover:border-secondary-50
      active:text-secondary-400 active:border-secondary-400 active:bg-black
      rounded-primary saber-glow`}>
      <Input disabled={false} mode="in" />
      <div className="absolute inset-0 px-4 flex items-center justify-end pointer-events-none rounded-primary">
        <Chip className="pl-3 pr-6 py-2 pointer-events-none">
          <TokenImg chainId={137} address={'0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'} size={32} bgClassName="bg-neutral-800" />
          <div>USDC</div>
        </Chip>
      </div>
    </div>

    <div className="w-full px-3 flex items-center justify-between text-neutral-500 text-sm">
      <div>$ 0.00</div>
      <div className="flex items-center gap-3">
        <Balance />
        <div>Balance 0.00</div>
        <Chip>Max</Chip>
      </div>
    </div>
  </div>
}

function Receipt() {
  return <div className="hidden w-full px-3 flex items-center justify-between text-neutral-500 text-sm">
    <div>You get (min)</div>
    <div className="flex items-center gap-3">
      <div>0.0000</div>
      <div>gUSDC-2</div>
    </div>
  </div>
}

export default function Zap() {
  return <div className="h-64 flex flex-col gap-6 rounded-primary">
    <Switch />
    <Deposit />
    <Receipt />
    <Button className="hidden" disabled={true}>Approve USDC</Button>
  </div>
}
