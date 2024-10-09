import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useHashNav(hashId: string, isDefault = false) {
  const navigate = useNavigate()
  const location = useLocation()
  const isOpen = location.hash === `#${hashId}`
  || (isDefault && (location.hash === '' || location.hash === '#'))

  const open = useCallback(() => {
    navigate(`${location.pathname}${location.search}#${hashId}`)
  }, [navigate, location.pathname, location.search, hashId])

  const close = useCallback(() => {
    if (isOpen) navigate(-1)
  }, [isOpen, navigate])

  const toggle = useCallback(() => {
    if (isOpen) close()
    else open()
  }, [isOpen, open, close])

  return { isOpen, open, close, toggle }
}
