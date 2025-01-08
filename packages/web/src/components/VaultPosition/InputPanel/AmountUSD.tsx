import { ReactNode, useMemo } from 'react'
import useBalances, { Token } from '../../../../../../hooks/useBalances'
import { fUSD } from '@kalani/lib/format'
import { priced } from '@kalani/lib/bmath'

export function AmountUsdDisplay({children}: {children?: ReactNode}) {
	return <div className="font-mono">{children ?? '...'}</div>
}

export function AmountUsd({ amount, token }: { amount: string | undefined, token: Token }) {
	const { getBalance } = useBalances({ tokens: [token] })
	const balance = useMemo(() => getBalance(token), [getBalance, token])

	const amountUsd = useMemo(() => {
		const asFloat = parseFloat(amount ?? '0')
		if (isNaN(asFloat)) return 0
		const expansion = BigInt(asFloat * 10 ** token.decimals)
		return priced(expansion, balance.decimals, balance.price)
	}, [amount, balance, token])

	return <AmountUsdDisplay>{balance.price ? fUSD(amountUsd) : 'price na'}</AmountUsdDisplay>
}
