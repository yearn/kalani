'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  return (
    <Sonner
      {...props}
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            `group toast px-10 py-6 rounded-primary
            group-[.toaster]:bg-neutral-950 group-[.toaster]:text-neutral-50 
            group-[.toaster]:border-neutral-800`,
          description: 'group-[.toast]:text-neutral-400',
          icon: 'group-[.toast]:hidden',
          actionButton: `
            group-[.toast]:!bg-neutral-950 
            group-[.toast]:!text-secondary-200 hover:group-[.toast]:!text-white
            group-[.toast]:cursor-pointer`,
          success: 'theme-default',
          loading: 'theme-confirm'
        }, 
      }}
    />
  )
}

export { Toaster }
