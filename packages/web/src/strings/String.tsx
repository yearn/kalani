import { useEffect, useState } from 'react'
import { useString } from './useString'

export default function String({ _key, args }: { _key: string, args?: any[] }) {
  const info = useString(_key)
  const [string, setString] = useState(info)
  useEffect(() => {
    if (!info || !args || args.length === 0) { setString(info) }
    else {
      let result = info
      for (let i = 0; i < args.length; i++) {
        result = result?.replace(`{${i}}`, args[i])
      }
      setString(result)
    }
  }, [info, args, setString])
  return <>{string}</>
}
