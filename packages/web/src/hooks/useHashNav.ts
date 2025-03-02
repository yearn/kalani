import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useHashNav(hashId: string, isDefault = false) {
  const navigate = useNavigate()
  const location = useLocation()

  const isOpen = useMemo(() => {
    return location.hash === `#${hashId}` || (isDefault && (location.hash === '' || location.hash === '#'))
  }, [location.hash, hashId, isDefault])

  const open = useCallback(() => {
    if (isOpen) return
    navigate(`${location.pathname}${location.search}#${hashId}`)
  }, [isOpen, navigate, location.pathname, location.search, hashId])

  const close = useCallback(() => {
    if (isOpen) navigate(-1)
  }, [isOpen, navigate])

  const toggle = useCallback(() => {
    if (isOpen) close()
    else open()
  }, [isOpen, open, close])

  return { isOpen, open, close, toggle }
}
