import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { PiX } from 'react-icons/pi'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../lib/shadcn'
import FlyInFromBottom from './motion/FlyInFromBottom'
import { springs } from '../lib/motion'
import Button from './elements/Button'

interface DialogProps {
  dialogId: string
  onClose?: () => void
  children: React.ReactNode
  showCloseButton?: boolean
  className?: string
}

const Dialog: React.FC<DialogProps> = ({
  dialogId,
  onClose,
  children,
  showCloseButton = true,
  className
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const prevLocationRef = useRef(location)

  const isOpen = location.hash === `#${dialogId}`

  useEffect(() => {
    prevLocationRef.current = location
  }, [location])

  const handleClose = () => {
    navigate(-1)
    onClose?.()
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.body.classList.add('overflow-hidden')
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
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
      <FlyInFromBottom _key={dialogId} className="w-full flex justify-center" transition={springs.glitch}>
        <div
          ref={dialogRef}
          className={cn(
            `relative bg-neutral-950 border border-neutral-800 rounded-t-primary sm:rounded-primary p-6 sm:p-12`,
            `w-full sm:max-w-md sm:mx-4`,
            `shadow-lg`,
            `max-h-[90vh] overflow-y-auto`,
            className
          )}
        >
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-neutral-400"
            >
              <PiX size={24} />
            </button>
          )}
          {children}
        </div>
      </FlyInFromBottom>
    </div>,
    document.body
  )
}

export default Dialog

export function DialogButton({ dialogId, children }: { dialogId: string, children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const openDialog = () => navigate(`${location.pathname}#${dialogId}`)
  return <Button onClick={openDialog}>{children}</Button>
}
