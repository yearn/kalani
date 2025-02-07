import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/shadcn'
import { InputClassName } from './Input'
import bmath from '@kalani/lib/bmath'
import { isSomething, parseInputNumberString } from '@kalani/lib/strings'

// function processInputAmount(input: string): string {
// 	const result = input.replace(/[^\d.,]/g, '').replace(/,/g, '.')
// 	const firstPeriod = result.indexOf('.')
// 	if (firstPeriod === -1) {
// 		return result
// 	} else {
// 		const firstPart = result.slice(0, firstPeriod + 1)
// 		const lastPart = result.slice(firstPeriod + 1).replace(/\./g, '')
// 		return firstPart + lastPart
// 	}
// }

export function InputTokenAmount({
	amount,
	symbol,
	decimals,
	onChange,
	disabled,
	className
}: {
	amount?: bigint | string | undefined,
	symbol: string,
	decimals: number,
	onChange?: (amount: bigint | undefined) => void,
	disabled?: boolean,
	className?: string
}) {
	const [rawInput, setRawInput] = useState<string | undefined>(amount === undefined ? undefined : String(amount))
	const inputRef = useRef<HTMLInputElement>(null)

	const displayAmount = useMemo(() => {
		if (isSomething(rawInput)) return parseInputNumberString(rawInput ?? '')
		if (amount === undefined) return ''
		return bmath.div(BigInt(amount), BigInt(10 ** decimals))
	}, [rawInput, amount, decimals])

	const _onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setRawInput(e.target.value)
	}, [setRawInput])

	useEffect(() => {
		if (rawInput === undefined || rawInput === '') {
			onChange?.(undefined)
		} else {
			const processedAmount = parseInputNumberString(rawInput ?? '')
			if (!isSomething(processedAmount)) {
				onChange?.(undefined)
			} else {
				onChange?.(BigInt(parseFloat(processedAmount) * (10 ** decimals)))
			}
		}
	}, [rawInput, onChange, decimals])

	const onClickSymbol = useCallback(() => {
		inputRef.current?.focus()
		inputRef.current?.select()
	}, [inputRef])

  return <div className={cn(InputClassName, className, 'group flex items-center justify-between gap-2')}>
		<input
			ref={inputRef}
			disabled={disabled}
			className={`w-full truncate 
				bg-transparent text-lg
				placeholder:text-neutral-500

				group-hover:text-secondary-50 group-hover:border-secondary-50
				group-has-[:focus]:text-secondary-400 group-has-[:focus]:border-secondary-400
				focus:text-secondary-400 focus:border-secondary-400

				disabled:text-neutral-400
				group-hover:disabled:text-neutral-400 group-hover:disabled:border-black
				disabled:placeholder-neutral-800 disabled:border-transparent

				outline-none focus:ring-0 focus:outline-none`}
			inputMode="decimal"
			autoComplete="off"
			autoCorrect="off"
			type="text"
			pattern="^[0-9]*[.,]?[0-9]*$"
			placeholder="0"
			spellCheck="false"
			onChange={_onChange}
			value={displayAmount}
		/>
    <div onClick={onClickSymbol} className={cn(`
      flex items-center justify-end
			font-bold text-lg text-neutral-500
      pointer-pointer`)}>
			{symbol}
    </div>
  </div>
}
