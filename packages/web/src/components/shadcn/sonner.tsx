import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const theme: ToasterProps['theme'] = 'dark'

const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner
    theme={theme}
    className='toaster group'
    toastOptions={{
      classNames: {
        toast:
          `group toast px-10 py-6 rounded-primary
          group-[.toaster]:bg-neutral-950 group-[.toaster]:text-neutral-50`,
        description: 'group-[.toast]:text-neutral-400',
        icon: 'group-[.toast]:hidden',
        actionButton: `
          group-[.toast]:!bg-neutral-950 
          group-[.toast]:!text-secondary-200 hover:group-[.toast]:!text-white
          group-[.toast]:cursor-pointer`,
        success: 'theme-default',
        loading: 'theme-confirm',
        error: `
          group-[.toaster]:bg-red-800 
          group-[.toaster]:text-neutral-50`,
        warning: `
          group-[.toaster]:bg-yellow-600 
          group-[.toaster]:text-neutral-950`,
      }, 
    }}
    {...props}
  />
}

export { Toaster }
