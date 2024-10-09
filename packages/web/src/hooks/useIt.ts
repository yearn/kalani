import { useMutation, useQuery, useQueryClient, QueryKey } from '@tanstack/react-query'

export function useIt<T>({ queryKey, initialValue }: { queryKey: QueryKey, initialValue: T }) {
  const queryClient = useQueryClient()

  const query = useQuery<T>({
    queryKey,
    queryFn: () => initialValue,
    staleTime: Infinity
  })

  const mutation = useMutation<T, void, T>({
    mutationFn: async (next: T) => next,
    onSuccess: async (next: T) => queryClient.setQueryData(queryKey, next)
  })

  return { query, mutation }
}
