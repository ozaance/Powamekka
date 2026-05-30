'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.ft-el', { opacity: 0 })
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top 92%',
        once: true,
        onEnter() {
          gsap.to('.ft-el', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
            stagger: 0.06,
          })
        },
      })
    }, footerRef)
    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#050508] overflow-hidden"
      style={{ paddingTop: '7vh', paddingBottom: '4vh' }}
    >
      {/* Hairline */}
      <div className="ft-el" style={{
        marginLeft: 'clamp(2rem, 5vw, 6rem)',
        marginRight: 'clamp(2rem, 5vw, 6rem)',
        height: '1px',
        background: 'linear-gradient(to right, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
        marginBottom: '4vh',
      }} />

      <div
        className="flex flex-col md:flex-row md:items-end justify-between"
        style={{
          paddingLeft: 'clamp(2rem, 5vw, 6rem)',
          paddingRight: 'clamp(2rem, 5vw, 6rem)',
          gap: '2.5rem',
        }}
      >
        {/* Signature */}
        <div className="ft-el flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,200,100,0.35)' }} />
            <span className="font-display font-light" style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.35)',
            }}>
              Studio Powamekka
            </span>
          </div>
          <p style={{
            fontSize: '11px',
            lineHeight: 1.55,
            fontFamily: 'var(--font-geist-sans)',
            color: 'rgba(255,255,255,0.18)',
            maxWidth: '220px',
          }}>
            Projets & collaborations<br />
            contact@powamekka.com
          </p>
        </div>

        {/* Nav footer */}
        <div className="ft-el hidden md:flex gap-7 items-end pb-0.5">
          {['Projets', 'À propos', 'Contact'].map((item) => (
            <button key={item} style={{
              fontSize: '11px',
              letterSpacing: '0.02em',
              fontFamily: 'var(--font-geist-sans)',
              color: 'rgba(255,255,255,0.18)',
              background: 'none', border: 'none',
              cursor: 'pointer',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Localisation */}
        <div className="ft-el flex flex-col items-start md:items-end gap-1.5">
          <span style={{ fontSize: '10px', letterSpacing: '0.06em', fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.16)' }}>
            Paris, France
          </span>
          <span style={{ fontSize: '10px', letterSpacing: '0.04em', fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.12)' }}>
            © 2026
          </span>
        </div>
      </div>
    </footer>
  )
}
