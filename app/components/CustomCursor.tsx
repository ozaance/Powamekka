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

    let mouseX = 0
    let mouseY = 0
    let dotX = 0
    let dotY = 0
    let ringX = 0
    let ringY = 0
    let isVisible = false

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isPointer = target.closest('a, button, [role="button"], .cursor-pointer, input, textarea')
      
      if (isPointer) {
        dot.style.transform = 'translate(-50%, -50%) scale(1.5)'
        dot.style.backgroundColor = 'rgba(255, 218, 150, 0.9)'
        ring.style.transform = 'translate(-50%, -50%) scale(1.6)'
        ring.style.borderColor = 'rgba(255, 218, 150, 0.6)'
        ring.style.borderWidth = '1.5px'
      } else {
        dot.style.transform = 'translate(-50%, -50%) scale(1)'
        dot.style.backgroundColor = 'rgba(255, 218, 150, 0.7)'
        ring.style.transform = 'translate(-50%, -50%) scale(1)'
        ring.style.borderColor = 'rgba(255, 218, 150, 0.2)'
        ring.style.borderWidth = '1px'
      }
    }

    const onMouseLeaveWindow = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const onMouseEnterWindow = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseleave', onMouseLeaveWindow)
    document.addEventListener('mouseenter', onMouseEnterWindow)

    // Tick function for smooth interpolation (LERP)
    let animId = 0
    const tick = () => {
      // Linear interpolation: current = current + (target - current) * factor
      dotX += (mouseX - dotX) * 0.25
      dotY += (mouseY - dotY) * 0.25
      ringX += (mouseX - ringX) * 0.08
      ringY += (mouseY - ringY) * 0.08

      dot.style.left = `${dotX}px`
      dot.style.top = `${dotY}px`
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`

      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)

    return () => {
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeaveWindow)
      document.removeEventListener('mouseenter', onMouseEnterWindow)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div
        id="cursor"
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 218, 150, 0.7)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          transition: 'transform 0.3s ease, background-color 0.3s ease, opacity 0.3s ease',
          willChange: 'left, top, transform',
        }}
      />
      <div
        id="cursor-ring"
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 218, 150, 0.2)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          transition: 'transform 0.4s ease, border-color 0.3s ease, border-width 0.3s ease, opacity 0.3s ease',
          willChange: 'left, top, transform',
        }}
      />
    </>
  )
}
