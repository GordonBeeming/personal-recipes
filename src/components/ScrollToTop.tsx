import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * whenever the route changes. This improves UX, especially on mobile devices,
 * by ensuring users see the top of the new page rather than staying at the
 * previous scroll position.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
