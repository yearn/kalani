import React, { forwardRef, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { PiX } from 'react-icons/pi'
import { cn } from '../lib/shadcn'
import FlyInFromBottom from './motion/FlyInFromBottom'
import { springs } from '../lib/motion'
import Button, { ButtonProps } from './elements/Button'
import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export function useDialog(dialogId: string) {
  const navigate = useNavigate()
  const location = useLocation()

  const isOpen = location.hash === `#${dialogId}`

  const openDialog = useCallback(() => {
    navigate(`${location.pathname}#${dialogId}`)
  }, [navigate, location.pathname, dialogId])

  const closeDialog = useCallback(() => {
    if (isOpen) navigate(-1)
  }, [isOpen, navigate])

  return { isOpen, openDialog, closeDialog }
}

interface DialogProps {
  dialogId: string
  title?: string
  onClose?: () => void
  children: React.ReactNode
  className?: string
}

const Dialog: React.FC<DialogProps> = ({
  dialogId,
  title,
  onClose,
  children,
  className
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { isOpen, closeDialog } = useDialog(dialogId)

  const handleClose = () => {
    closeDialog()
    onClose?.()
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    if (isOpen) {
      document.body.classList.add('overflow-hidden')
      document.body.style.marginRight = `${scrollbarWidth}px`
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.classList.remove('overflow-hidden')
      document.body.style.marginRight = ''
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
      document.body.style.marginRight = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      <FlyInFromBottom _key={dialogId} className="w-full flex justify-center pointer-events-none" transition={springs.glitch}>
        <div
          ref={dialogRef}
          className={cn(
            `relative w-full sm:max-w-md max-h-[90vh] p-6 sm:px-8 sm:py-6
            flex flex-col gap-12
            bg-neutral-950 border border-neutral-800
            rounded-t-primary sm:rounded-primary
            shadow-lg overflow-y-auto pointer-events-auto`,
            className
          )}>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{title}</div>
            <button
              onClick={handleClose}
              className="text-neutral-700">
              <PiX size={24} />
            </button>
          </div>
          {children}
        </div>
      </FlyInFromBottom>
    </div>,
    document.body
  )
}

export default Dialog

export const DialogButton = forwardRef<HTMLButtonElement, ButtonProps & { dialogId: string; children: React.ReactNode }>(
  ({ dialogId, children, ...props }, ref) => {
    const { openDialog } = useDialog(dialogId)
    return <Button ref={ref} onClick={openDialog} {...props}>{children}</Button>
  }
)

DialogButton.displayName = 'DialogButton'
