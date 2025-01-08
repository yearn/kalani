import { fTokens } from '@kalani/lib/format'
import {ReactNode, useMemo} from 'react'
import useBalances, { Token } from '../../../hooks/useBalances'

export function BalanceDisplay({children}: {children?: ReactNode}) {
  return <div>
    Balance: <span className="font-mono">{children ?? '...'}</span>
  </div>
}

export function Balance({token}: {token: Token}) {
  const {getBalance} = useBalances({tokens: [token]})
  const balance = useMemo(() => getBalance(token), [getBalance, token])
  return <BalanceDisplay>{fTokens(balance.amount, balance.decimals)}</BalanceDisplay>
}
