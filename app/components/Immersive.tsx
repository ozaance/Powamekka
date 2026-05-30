'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Immersive() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const qRotateX = gsap.quickTo(cardRef.current, 'rotateX', { duration: 2.4, ease: 'power2.out' })
    const qRotateY = gsap.quickTo(cardRef.current, 'rotateY', { duration: 2.4, ease: 'power2.out' })

    const onMove = (e: MouseEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      qRotateX(-y * 4)
      qRotateY(x * 6)
    }
    const onLeave = () => { qRotateX(0); qRotateY(0) }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('mousemove', onMove, { passive: true })
      section.addEventListener('mouseleave', onLeave, { passive: true })
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate(self) {
          if (imageRef.current) {
            gsap.set(imageRef.current, {
              scale: 1 + self.progress * 0.08,
              y: self.progress * -35,
              opacity: 0.45 + self.progress * 0.3,
            })
          }
        },
      })

      gsap.set('.im-label', { opacity: 0, x: -10 })
      gsap.set('.im-title', { opacity: 0, yPercent: 105 })
      gsap.set('.im-card', { opacity: 0, y: 24 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 66%',
        once: true,
        onEnter() {
          const tl = gsap.timeline()
          tl.to('.im-label', { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' })
          tl.to('.im-title', { opacity: 1, yPercent: 0, duration: 1.0, ease: 'power3.out' }, 0.1)
          tl.to('.im-card', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.3)
        },
      })
    }, sectionRef)

    return () => {
      if (section) {
        section.removeEventListener('mousemove', onMove)
        section.removeEventListener('mouseleave', onLeave)
      }
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#050508] select-none"
      style={{ paddingTop: '14vh', paddingBottom: '14vh', perspective: '1400px' }}
    >
      {/* Lumière froide à droite */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 55% at 95% 50%, rgba(160,185,255,0.03) 0%, transparent 65%)',
      }} />

      <div className="relative z-10" style={{
        paddingLeft: 'clamp(2rem, 5vw, 6rem)',
        paddingRight: 'clamp(2rem, 5vw, 6rem)',
      }}>
        {/* Caption */}
        <div className="mb-10 flex flex-col gap-3">
          <div className="im-label flex items-center gap-3">
            <div style={{ width: '24px', height: '1px', background: 'rgba(255,200,100,0.22)' }} />
            <span style={{ fontSize: '10px', letterSpacing: '0.1em', fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.22)' }}>
              Notre approche
            </span>
          </div>
          <div style={{ overflow: 'hidden', lineHeight: 0.9 }}>
            <h2
              className="im-title font-display font-light"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 6rem)',
                letterSpacing: '-0.025em',
                lineHeight: 0.9,
                color: 'rgba(255,255,255,0.75)',
                display: 'block',
              }}
            >
              Le détail fait{' '}
              <em style={{ color: 'rgba(255,200,100,0.45)', fontStyle: 'italic' }}>la différence.</em>
            </h2>
          </div>
        </div>

        {/* Cadre 3D */}
        <div
          ref={cardRef}
          className="im-card relative overflow-hidden"
          style={{
            width: '100%',
            height: 'clamp(220px, 40vw, 580px)',
            transformStyle: 'preserve-3d',
            backgroundColor: '#080810',
          }}
        >
          <Image
            ref={imageRef}
            src="/images/immersive.jpg"
            alt="Réalisation Studio"
            fill
            sizes="100vw"
            className="absolute inset-0 object-cover"
            style={{ height: '130%', top: '-15%', opacity: 0.45, transformOrigin: 'center center' }}
            loading="lazy"
          />

          {/* Fallback gradient */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(8,10,22,0.92) 0%, rgba(5,5,8,0.25) 50%, rgba(12,14,28,0.85) 100%)',
            zIndex: 1,
          }} />

          {/* Vignettes */}
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to right, rgba(5,5,8,0.65) 0%, transparent 22%, transparent 78%, rgba(5,5,8,0.65) 100%)',
            zIndex: 2,
          }} />
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to bottom, rgba(5,5,8,0.4) 0%, transparent 28%, transparent 72%, rgba(5,5,8,0.75) 100%)',
            zIndex: 2,
          }} />

          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 p-6 md:p-10" style={{ zIndex: 3 }}>
            <p className="font-display font-light italic" style={{
              fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.25)',
            }}>
              Chaque pixel est une décision.
            </p>
          </div>
        </div>

        {/* Index */}
        <div className="mt-5 flex justify-end">
          <span style={{ fontSize: '10px', letterSpacing: '0.04em', fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.12)' }}>
            IV
          </span>
        </div>
      </div>
    </section>
  )
}
