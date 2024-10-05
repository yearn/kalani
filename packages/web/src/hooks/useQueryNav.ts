import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useQueryNav(queryId: string, isDefault = false) {
  const navigate = useNavigate()
  const location = useLocation()
  const isOpen = location.search === `?${queryId}`
  || (isDefault && (location.search === '' || location.search === '?'))

  const open = useCallback(() => {
    navigate(`${location.pathname}?${queryId}`)
  }, [navigate, location.pathname, queryId])

  const close = useCallback(() => {
    if (isOpen) navigate(-1)
  }, [isOpen, navigate])

  const toggle = useCallback(() => {
    if (isOpen) close()
    else open()
  }, [isOpen, open, close])

  return { isOpen, open, close, toggle }
}
