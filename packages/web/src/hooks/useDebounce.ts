import { useState, useEffect, useRef } from 'react'

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		timeoutRef.current = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [value, delay])

	return debouncedValue
}

export default useDebounce
