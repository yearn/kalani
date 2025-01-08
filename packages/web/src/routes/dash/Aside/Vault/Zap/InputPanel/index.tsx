import {useAccount} from 'wagmi'
import {Suspense, useMemo} from 'react'
import {Input, InputDisplay} from './Input'
import {Balance, BalanceDisplay} from './Balance'
import {MaxButton, MaxButtonDisplay} from './MaxButton'
import { cn } from '../../../../../../lib/shadcn'
import { useParameters } from '../useParameters'
import Button from '../../../../../../components/elements/Button'
import { AmountUsd, AmountUsdDisplay } from './AmountUSD'
import TokenImg from '../../../../../../components/TokenImg'

export default function InputPanel({mode, onSelectToken}: {mode: 'in' | 'out', onSelectToken?: () => void}) {
	const {isConnected} = useAccount()
	const disabled = useMemo(() => !isConnected, [isConnected])
	const isModeIn = useMemo(() => mode === 'in', [mode])
	const label = useMemo(() => (isModeIn ? 'Zap in' : 'Zap out (min)'), [isModeIn])

	const labelClassName = useMemo(() => {
		return cn('text-sm', disabled ? 'text-neutral-600' : 'text-neutral-300')
	}, [disabled])

	const {inputToken, inputAmount, setInputAmount, outputToken, outputAmount, setOutputAmount} = useParameters()

	const token = useMemo(() => (isModeIn ? inputToken : outputToken), [isModeIn, inputToken, outputToken])
	const amount = useMemo(() => (isModeIn ? inputAmount : outputAmount), [isModeIn, inputAmount, outputAmount])
	const setAmount = useMemo(
		() => (isModeIn ? setInputAmount : setOutputAmount),
		[isModeIn, setInputAmount, setOutputAmount]
	)

	return (
		<div
			className={`group
    px-4 py-6 bg-input-bg rounded-xl
    flex flex-col justify-center gap-3
    border border-transparent focus-within:border-bright-primary`}>
			<div className={labelClassName}>{label}</div>
			<div className="flex items-center gap-4">
				<Suspense fallback={<InputDisplay />}>
					<Input
						disabled={disabled || mode === 'out'}
						mode={mode}
					/>
				</Suspense>
				<Button
					h="secondary"
					disabled={disabled}
					onClick={onSelectToken}
					className="group px-2 py-2 flex items-center gap-2 !rounded-full">
					<div className="size-[32px]">
						{token && (
							<TokenImg
								chainId={token.chainId}
								address={token.address}
								size={32}
								bgClassName="bg-neutral-800"
							/>
						)}

						{!token && (
							<div className="size-[30px] border-2 border-dashed border-neutral-200 rounded-full"></div>
						)}
					</div>
					<div>{token?.symbol ?? 'Select a token'}</div>
					<div className={cn('pr-1 text-xs', disabled ? 'fill-neutral-600' : 'fill-neutral-200')}>▼</div>
				</Button>
			</div>
			<div className={cn(labelClassName, 'flex items-center justify-between text-sm')}>
				{token && (
					<>
						<Suspense fallback={<AmountUsdDisplay />}>
							<AmountUsd
								amount={amount}
								token={token}
							/>
						</Suspense>
						<div className="flex items-center gap-2">
							<Suspense fallback={<BalanceDisplay />}>
								<Balance token={token} />
							</Suspense>
							{isModeIn && (
								<Suspense fallback={<MaxButtonDisplay disabled={true} />}>
									<MaxButton
										token={token}
										setAmount={setAmount}
										disabled={disabled}
									/>
								</Suspense>
							)}
						</div>
					</>
				)}

				{!token && <div className="h-7"></div>}
			</div>
		</div>
	)
}
