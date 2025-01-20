import { useEffect, useState } from 'react'
import strings from './strings.json'

export async function importString(key: string) {
  if (!key) return
  try {
    const module = await import(`../strings/${key}.md`)
    return module.default
  } catch (err) {
    if (key! in strings) {
      return strings[key as keyof typeof strings]
    } else {
      throw new Error(`String key not found, '${key}'`)
    }
  }
}

export function useString(key: string) {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      try {
        setContent(await importString(key))
      } catch (err) {
        setError(err as string)
      }
    }
    fetch()
  }, [key])

  if (error) throw new Error(error)

  return content
}
