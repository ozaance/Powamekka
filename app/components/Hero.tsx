'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const NAV = ['Projets', 'À propos', 'Contact']

const SphereCanvas = dynamic(() => import('./SphereCanvas'), { ssr: false })

// ─── Hero ──────────────────────────────────────────────────────────
export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState('')
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768 && !/Mobi/i.test(navigator.userAgent))
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop, { passive: true })
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('fr-FR', {
      timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false,
    }))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  // Parallax natif — pas de GSAP ScrollTrigger
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const onScroll = () => {
      const p = Math.min(window.scrollY / (window.innerHeight * 0.7), 1)
      el.style.transform = `translateY(${p * -40}px)`
      el.style.opacity = String(1 - p * 0.8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#050508' }}
    >
      {isDesktop && <SphereCanvas />}

      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 70% at 0% 65%, rgba(255,205,120,0.06) 0%, transparent 60%)',
      }} />

      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.72\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')",
        backgroundSize: '256px 256px', opacity: 0.045, mixBlendMode: 'overlay',
      }} />

      <div aria-hidden className="absolute left-0 inset-y-0 pointer-events-none" style={{
        width: '1px',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.05) 15%, rgba(255,255,255,0.05) 85%, transparent 100%)',
      }} />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col h-full justify-between"
        style={{ paddingLeft: 'clamp(2rem, 5vw, 6rem)', paddingRight: 'clamp(2rem, 5vw, 6rem)' }}
      >
        {/* NAV — CSS animation */}
        <nav className="flex justify-between items-center pt-9" style={{ animation: 'hFadeIn 0.7s ease-out 0.2s both' }}>
          <div className="flex items-center gap-2.5">
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,205,120,0.55)' }} />
            <span style={{ fontSize: '11px', letterSpacing: '0.06em', fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.42)' }}>
              Studio Powamekka
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <button key={item} style={{
                fontSize: '11px', letterSpacing: '0.025em',
                fontFamily: 'var(--font-geist-sans)',
                color: 'rgba(255,255,255,0.20)',
                background: 'none', border: 'none', transition: 'color 220ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.20)')}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>

        {/* HEADLINE */}
        <div className="flex-1 flex flex-col justify-end" style={{ paddingBottom: 'clamp(5rem, 14vh, 9rem)' }}>

          <div style={{
            width: '52px', height: '1.5px',
            background: 'rgba(255,200,100,0.55)',
            marginBottom: '1.5rem',
            transformOrigin: 'left center',
            animation: 'hScaleX 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both',
          }} />

          <div style={{ overflow: 'hidden' }}>
            <h1 className="h-line1 font-display font-light" style={{
              fontSize: 'clamp(4rem, 12.5vw, 16rem)',
              letterSpacing: '-0.05em', lineHeight: 0.83,
              color: 'rgba(255,255,255,0.87)', display: 'block',
              animation: 'hSlideUp 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s both',
            }}>
              Sites web
            </h1>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <h1 className="font-display italic font-light" style={{
              fontSize: 'clamp(2rem, 6.5vw, 8.5rem)',
              letterSpacing: '-0.035em', lineHeight: 0.95,
              color: 'rgba(255,195,90,0.42)', display: 'block',
              paddingLeft: 'clamp(0.5rem, 1.2vw, 1.5rem)',
              animation: 'hSlideUp 1.3s cubic-bezier(0.16,1,0.3,1) 0.5s both',
            }}>
              qui marquent.
            </h1>
          </div>

          <div className="flex justify-between items-baseline" style={{ marginTop: '2rem', animation: 'hFadeIn 0.9s ease-out 0.85s both' }}>
            <p style={{
              fontSize: '12px', fontFamily: 'var(--font-geist-sans)',
              color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em', margin: 0,
            }}>
              Design & développement — Paris.
            </p>

            <button
              className="group flex items-center gap-3"
              style={{ background: 'none', border: 'none', flexShrink: 0, cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => {
                const span = e.currentTarget.querySelector('span') as HTMLElement
                const line = e.currentTarget.querySelector('div') as HTMLElement
                if (span) span.style.color = 'rgba(255,200,100,0.85)'
                if (line) { line.style.background = 'rgba(255,200,100,0.85)'; line.style.width = '44px' }
              }}
              onMouseLeave={e => {
                const span = e.currentTarget.querySelector('span') as HTMLElement
                const line = e.currentTarget.querySelector('div') as HTMLElement
                if (span) span.style.color = 'rgba(255,255,255,0.32)'
                if (line) { line.style.background = 'rgba(250,200,100,0.40)'; line.style.width = '28px' }
              }}
            >
              <span style={{ fontSize: '10px', letterSpacing: '0.14em', fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.32)', transition: 'color 220ms ease' }}>
                DÉMARRER
              </span>
              <div style={{ width: '28px', height: '1px', background: 'rgba(255,200,100,0.40)', transition: 'width 280ms ease, background 220ms ease' }} />
            </button>
          </div>
        </div>

        {/* PIED */}
        <div className="flex justify-between items-end pb-7" style={{ animation: 'hFadeIn 0.7s ease-out 1.1s both' }}>
          <div className="flex items-center gap-0">
            <div className="relative overflow-hidden" style={{ width: '1px', height: '38px', background: 'rgba(255,255,255,0.07)' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '45%',
                background: 'rgba(255,205,120,0.55)', animation: 'sP 2.6s ease-in-out infinite',
              }} />
            </div>
          </div>
          <div className="text-right">
            <div style={{ fontSize: '9px', letterSpacing: '0.05em', fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.10)' }}>Paris</div>
            <div style={{ fontSize: '11px', letterSpacing: '0.04em', fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.26)' }}>{time}</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hSlideUp { from { opacity: 0; transform: translateY(108%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hScaleX { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes sP {
          0%   { transform: translateY(-100%); opacity: 0; }
          12%  { opacity: 1; }
          65%  { transform: translateY(140px); opacity: 1; }
          88%  { transform: translateY(140px); opacity: 0; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
