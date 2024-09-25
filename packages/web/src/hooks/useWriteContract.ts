import { useState } from 'react'
import { toast } from 'sonner'
import { useConfig, useWriteContract as _useWriteContract } from 'wagmi'

export function useWriteContract() {
  const config = useConfig()
  const [resolveToast, setResolveToast] = useState<(() => (value: unknown) => void)>(() => () => {})

  const write = _useWriteContract({
		mutation: {
			onError(error) {
        toast.error(error.name, { description: error.message })
        console.error(error)
			},
			onSuccess(hash) {
        const explorer = `${config.getClient().chain.blockExplorers?.default.url}/tx/${hash}`
        toast.promise(
          new Promise((resolve) => setResolveToast(() => resolve)),
          {
            loading: `Confirming transaction...`,
            success: () => `Transaction confirmed`,
            action: {
              label: 'View', onClick: () => window.open(explorer, '_blank')
            }
          }
        )
			}
    }
  })

  return { write, resolveToast }
}
