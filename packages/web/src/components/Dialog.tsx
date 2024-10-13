import React, { forwardRef, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { PiX } from 'react-icons/pi'
import { cn } from '../lib/shadcn'
import FlyInFromBottom from './motion/FlyInFromBottom'
import { springs } from '../lib/motion'
import Button, { ButtonProps } from './elements/Button'
import { useHashNav } from '../hooks/useHashNav'
import confetti from 'canvas-confetti'

function useFireworks({ enabled }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) return
    setTimeout(() => {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;
  
      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
  
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
  
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          zIndex: 50,
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          zIndex: 50,
        });
      }, 250)
    }, 250)
  }, [enabled])
}

export function useDialog(dialogId: string) {
  const nav = useHashNav(dialogId)
  return { isOpen: nav.isOpen, openDialog: nav.open, closeDialog: nav.close }
}

interface DialogProps {
  dialogId: string
  title?: string
  onClose?: () => void
  fireworks?: boolean
  children: React.ReactNode
  className?: string
}

const Dialog: React.FC<DialogProps> = ({
  dialogId,
  title,
  onClose,
  fireworks,
  children,
  className
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { isOpen, closeDialog } = useDialog(dialogId)
  useFireworks({ enabled: isOpen && fireworks })

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
