import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useHashNav(hashId: string) {
  const navigate = useNavigate()
  const location = useLocation()
  const isOpen = location.hash === `#${hashId}`

  const open = useCallback(() => {
    navigate(`${location.pathname}#${hashId}`)
  }, [navigate, location.pathname, hashId])

  const close = useCallback(() => {
    if (isOpen) navigate(-1)
  }, [isOpen, navigate])

  const toggle = useCallback(() => {
    if (isOpen) close()
    else open()
  }, [isOpen, open, close])

  return { isOpen, open, close, toggle }
}