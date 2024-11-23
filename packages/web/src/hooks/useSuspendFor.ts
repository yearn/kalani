import { useSuspenseQuery } from '@tanstack/react-query'

export function useSuspendFor(milliseconds: number, nonce?: string) {
  return useSuspenseQuery({
    queryKey: ['useSuspendFor', milliseconds, nonce],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, milliseconds))
      return {}
    }
  })
}
