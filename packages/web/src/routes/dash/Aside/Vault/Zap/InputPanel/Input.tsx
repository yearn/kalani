import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParameters } from '../useParameters'
import useDebounce from '../../../../../../hooks/useDebounce'

export function InputDisplay({
	disabled,
	onChange,
	value
}: {
	disabled?: boolean
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	value?: string
}) {
	return (
		<input
			disabled={disabled}
			className={`
  relative w-full text-4xl font-mono bg-transparent truncate
  placeholder:text-neutral-500
  disabled:text-neutral-400 disabled:bg-transparent hover:disabled:border-neutral-950
  disabled:border-transparent outline-none focus:ring-0 focus:outline-none`}
			inputMode="decimal"
			autoComplete="off"
			autoCorrect="off"
			type="text"
			pattern="^[0-9]*[.,]?[0-9]*$"
			placeholder="0"
			min="1"
			max="79"
			spellCheck="false"
			onChange={onChange}
			value={value}
		/>
	)
}

export function Input({mode, disabled}: {mode: 'in' | 'out', disabled: boolean}) {
	const {inputAmount, setInputAmount, outputAmount, setOutputAmount} = useParameters()

	const isModeIn = useMemo(() => mode === 'in', [mode])
	const amount = useMemo(() => (isModeIn ? inputAmount : outputAmount), [isModeIn, inputAmount, outputAmount])
	const setAmount = useMemo(
		() => (isModeIn ? setInputAmount : setOutputAmount),
		[isModeIn, setInputAmount, setOutputAmount]
	)

	function processInputAmount(input: string): string {
		const result = input.replace(/[^\d.,]/g, '').replace(/,/g, '.')
		const firstPeriod = result.indexOf('.')
		if (firstPeriod === -1) {
			return result
		} else {
			const firstPart = result.slice(0, firstPeriod + 1)
			const lastPart = result.slice(firstPeriod + 1).replace(/\./g, '')
			return firstPart + lastPart
		}
	}

	const [rawInput, setRawInput] = useState<string | undefined>(amount)
	const onRawInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setRawInput(e.target.value)
		},
		[setRawInput]
	)

	const debouncedInput = useDebounce(rawInput, 48)

	useEffect(() => {
		const processedAmount = processInputAmount(debouncedInput ?? '')
		setAmount(processedAmount)
	}, [debouncedInput, mode, setAmount])

	return <InputDisplay
    disabled={disabled}
    onChange={onRawInputChange}
    value={amount ?? ''}
  />
}
