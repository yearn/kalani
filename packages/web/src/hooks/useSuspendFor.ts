import { useSuspenseQuery } from '@tanstack/react-query'

export function useSuspendFor(seconds: number) {
  return useSuspenseQuery({
    queryKey: ['useSuspendFor', seconds],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, seconds * 1000))
      return {}
    }
  })
}
