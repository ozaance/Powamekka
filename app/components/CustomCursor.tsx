'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable custom cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    // Hide default cursor
    document.body.style.cursor = 'none'

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const initCursor = async () => {
      const { default: gsap } = await import('gsap')

      // Initialize opacity to 0 to prevent initial layout flash
      gsap.set([dot, ring], { opacity: 0 })

      // GSAP quickTo for smooth coordinate tracking with organic lag (tension)
      const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })

      const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' })
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' })

      const onMouseMove = (e: MouseEvent) => {
        // Set opacity to 1 on first movement
        gsap.set([dot, ring], { opacity: 1 })
        
        dotX(e.clientX)
        dotY(e.clientY)
        
        ringX(e.clientX)
        ringY(e.clientY)
      }

      // Hover transformations on pointer/interactive tags (event delegation)
      const onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const isPointer = target.closest('a, button, [role="button"], .cursor-pointer, input, textarea')
        
        if (isPointer) {
          gsap.to(dot, {
            scale: 1.5,
            backgroundColor: 'rgba(255, 218, 150, 0.9)',
            duration: 0.3,
            ease: 'power2.out'
          })
          gsap.to(ring, {
            scale: 1.6,
            borderColor: 'rgba(255, 218, 150, 0.6)',
            borderWidth: '1.5px',
            duration: 0.3,
            ease: 'power2.out'
          })
        } else {
          gsap.to(dot, {
            scale: 1,
            backgroundColor: 'rgba(255, 218, 150, 0.7)',
            duration: 0.3,
            ease: 'power2.out'
          })
          gsap.to(ring, {
            scale: 1,
            borderColor: 'rgba(255, 218, 150, 0.2)',
            borderWidth: '1px',
            duration: 0.3,
            ease: 'power2.out'
          })
        }
      }

      // Fade out when cursor leaves browser window
      const onMouseLeaveWindow = () => {
        gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
      }

      // Fade in when cursor enters browser window
      const onMouseEnterWindow = () => {
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
      }

      window.addEventListener('mousemove', onMouseMove, { passive: true })
      window.addEventListener('mouseover', onMouseOver, { passive: true })
      document.addEventListener('mouseleave', onMouseLeaveWindow)
      document.addEventListener('mouseenter', onMouseEnterWindow)

      return () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseover', onMouseOver)
        document.removeEventListener('mouseleave', onMouseLeaveWindow)
        document.removeEventListener('mouseenter', onMouseEnterWindow)
      }
    }

    const cleanupPromise = initCursor()

    return () => {
      document.body.style.cursor = 'auto'
      cleanupPromise.then(cleanup => cleanup?.())
    }
  }, [])

  return (
    <>
      <div
        id="cursor"
        ref={dotRef}
        style={{ opacity: 0 }}
      />
      <div
        id="cursor-ring"
        ref={ringRef}
        style={{ opacity: 0 }}
      />
    </>
  )
}
