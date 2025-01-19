import { useEffect, useState } from 'react'

export function useInfo(key: string): string | null {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInfo() {
      try {
        const module = await import(`../infos/${key}.md`)
        setContent(module.default)
      } catch (err) {
        setError(`Info key not found, ${key}`)
        console.error(err)
      }
    }
    fetchInfo()
  }, [key])

  if (error) throw new Error(error)

  return content
}
