import {useAccount} from 'wagmi'
import {Suspense, useMemo} from 'react'
import {Input, InputDisplay} from './Input'
import {Balance, BalanceDisplay} from './Balance'
import {MaxButton, MaxButtonDisplay} from './MaxButton'
import { cn } from '../../../lib/shadcn'
import { useDepositParameters } from '../useDepositParameters'
import Button from '../../../components/elements/Button'
import { AmountUsd, AmountUsdDisplay } from './AmountUSD'
import TokenImg from '../../../components/TokenImg'

export default function InputPanel({mode, onSelectToken}: {mode: 'in' | 'out', onSelectToken?: () => void}) {
	const {isConnected} = useAccount()
	const disabled = useMemo(() => !isConnected, [isConnected])
	const isModeIn = useMemo(() => mode === 'in', [mode])
	const label = useMemo(() => (isModeIn ? 'Zap in' : 'Zap out (min)'), [isModeIn])

	const labelClassName = useMemo(() => {
		return cn('text-sm', disabled ? 'text-neutral-600' : 'text-neutral-300')
	}, [disabled])

	const { asset, amount, setAmount } = useDepositParameters()

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
						{asset && (
							<TokenImg
								chainId={asset.chainId}
								address={asset.address}
								size={32}
								bgClassName="bg-neutral-800"
							/>
						)}

						{!asset && (
							<div className="size-[30px] border-2 border-dashed border-neutral-200 rounded-full"></div>
						)}
					</div>
					<div>{asset?.symbol ?? 'Select a token'}</div>
					<div className={cn('pr-1 text-xs', disabled ? 'fill-neutral-600' : 'fill-neutral-200')}>▼</div>
				</Button>
			</div>
			<div className={cn(labelClassName, 'flex items-center justify-between text-sm')}>
				{asset && (
					<>
						<Suspense fallback={<AmountUsdDisplay />}>
							<AmountUsd
								amount={amount}
								token={asset}
							/>
						</Suspense>
						<div className="flex items-center gap-2">
							<Suspense fallback={<BalanceDisplay />}>
								<Balance token={asset} />
							</Suspense>
							{isModeIn && (
								<Suspense fallback={<MaxButtonDisplay disabled={true} />}>
									<MaxButton
										token={asset}
										setAmount={setAmount}
										disabled={disabled}
									/>
								</Suspense>
							)}
						</div>
					</>
				)}

				{!asset && <div className="h-7"></div>}
			</div>
		</div>
	)
}
