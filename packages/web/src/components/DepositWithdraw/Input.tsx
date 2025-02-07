import { useCallback, useEffect, useState } from 'react'
import { useParameters } from './useParameters'
import useDebounce from '../../hooks/useDebounce'
import { cn } from '../../lib/shadcn'
import { parseInputNumberString } from '@kalani/lib/strings'

function InputDisplay({
	disabled,
	onChange,
	value,
	className
}: {
	disabled?: boolean
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	value?: string,
	className?: string
}) {
	return (
		<input
			disabled={ disabled }
			className={cn(`
  relative w-full bg-transparent truncate
  placeholder:text-neutral-500
  disabled:text-neutral-400 disabled:bg-transparent hover:disabled:border-neutral-950
  disabled:border-transparent outline-none focus:ring-0 focus:outline-none
	`, className)}
			inputMode="decimal"
			autoComplete="off"
			autoCorrect="off"
			type="text"
			pattern="^[0-9]*[.,]?[0-9]*$"
			placeholder="0"
			spellCheck="false"
			onChange={ onChange }
			value={ value }
		/>
	)
}

export function Input({ className, mode, disabled }: { className?: string, mode: 'in' | 'out', disabled?: boolean }) {
	const { amount, setAmount } = useParameters()

	const [rawInput, setRawInput] = useState<string | undefined>(amount)
	const onRawInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setRawInput(e.target.value)
		},
		[setRawInput]
	)

	const debouncedInput = useDebounce(rawInput, 48)

	useEffect(() => {
		const processedAmount = parseInputNumberString(debouncedInput ?? '')
		setAmount(processedAmount)
	}, [debouncedInput, mode, setAmount])

	return <InputDisplay
		className={className}
    disabled={disabled}
    onChange={onRawInputChange}
    value={amount ?? ''}
  />
}
