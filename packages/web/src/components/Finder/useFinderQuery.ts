import { useIt } from '../../hooks/useIt'

export function useFinderQuery() {
  const { query, mutation } = useIt<string>({ queryKey: ['useFinderQuery'], initialValue: '' })
  return { query: query.data ?? '', setQuery: mutation.mutate }
}
