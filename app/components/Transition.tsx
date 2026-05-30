'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Transition() {
  const sectionRef = useRef<HTMLElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Registre : tout arrive depuis l'opacité pure — pas de translation
      // Sentiment d'apparition progressive, comme un fondu au noir inversé
      gsap.set('.tc-line', { opacity: 0, scaleX: 0, transformOrigin: 'center center' })
      gsap.set('.tc-head', { opacity: 0 })
      gsap.set('.tc-sub', { opacity: 0 })
      gsap.set('.tc-btn', { opacity: 0, scale: 0.97 })
      gsap.set('.tc-alt', { opacity: 0 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 62%',
        once: true,
        onEnter() {
          const tl = gsap.timeline()

          tl.to('.tc-line', {
            opacity: 1, scaleX: 1,
            duration: 2.0, ease: 'expo.inOut',
          })

          tl.to('.tc-head', {
            opacity: 1,
            duration: 1.1, ease: 'power2.out',
            stagger: 0.14,
          }, 0.5)

          tl.to('.tc-sub', {
            opacity: 1,
            duration: 0.8, ease: 'power2.out',
          }, 1.1)

          tl.to('.tc-btn', {
            opacity: 1, scale: 1,
            duration: 0.8, ease: 'power3.out',
          }, 1.3)

          tl.to('.tc-alt', {
            opacity: 1,
            duration: 0.6, ease: 'power2.out',
          }, 1.7)
        },
      })

      // Ligne qui suit le scroll — s'étire
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate(self) {
          if (lineRef.current) {
            gsap.set(lineRef.current, {
              width: `${Math.min(40 + self.progress * 60, 100)}%`,
            })
          }
        },
      })

    }, sectionRef)

    // Effet magnétique sur le bouton CTA
    const btn = btnRef.current
    if (!btn) return

    const onBtnMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * 0.18
      const dy = (e.clientY - cy) * 0.18
      gsap.to(btn, { x: dx, y: dy, duration: 0.5, ease: 'power2.out' })
    }

    const onBtnLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    }

    btn.addEventListener('mousemove', onBtnMove)
    btn.addEventListener('mouseleave', onBtnLeave)

    return () => {
      ctx.revert()
      btn.removeEventListener('mousemove', onBtnMove)
      btn.removeEventListener('mouseleave', onBtnLeave)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#050508] flex flex-col items-center justify-center"
      style={{ minHeight: '75vh', paddingTop: '12vh', paddingBottom: '12vh' }}
    >
      {/* Pic atmosphérique — la lumière chaude atteint son maximum ici */}
      {/* C'est le moment émotionnel le plus fort du site */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 75% 65% at 50% 55%, rgba(255,195,90,0.07) 0%, rgba(255,170,50,0.025) 45%, transparent 70%)',
      }} />

      {/* Grain légèrement plus dense ici */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
        opacity: 0.06,
        mixBlendMode: 'overlay',
      }} />

      <div className="relative z-10 flex flex-col items-center" style={{
        paddingLeft: 'clamp(2rem, 5vw, 6rem)',
        paddingRight: 'clamp(2rem, 5vw, 6rem)',
        maxWidth: '800px',
        width: '100%',
      }}>

        {/* Ligne centrale — signature */}
        <div
          ref={lineRef}
          className="tc-line mb-16"
          style={{
            height: '1px',
            width: '40%',
            background: 'linear-gradient(to right, transparent, rgba(255,200,100,0.25) 30%, rgba(255,200,100,0.25) 70%, transparent)',
          }}
        />

        {/* Headline CTA — direct, émotionnel, pas philosophique */}
        <div className="flex flex-col items-center" style={{ gap: '0.04em', textAlign: 'center' }}>
          {[
            { text: 'Votre prochain site', italic: false },
            { text: 'devrait être', italic: false },
            { text: 'inoubliable.', italic: true },
          ].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <p
                className={`tc-head font-display font-light${line.italic ? ' italic' : ''}`}
                style={{
                  fontSize: i === 2 ? 'clamp(2.4rem, 5.5vw, 7.5rem)' : 'clamp(1.8rem, 4vw, 5.5rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 0.95,
                  color: line.italic ? 'rgba(255,200,100,0.60)' : 'rgba(255,248,235,0.60)',
                  display: 'block',
                }}
              >
                {line.text}
              </p>
            </div>
          ))}
        </div>

        {/* Sous-texte */}
        <p className="tc-sub mt-8" style={{
          fontSize: '12px',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
          fontFamily: 'var(--font-geist-sans)',
          color: 'rgba(255,255,255,0.22)',
          textAlign: 'center',
          maxWidth: '320px',
        }}>
          Parlez-nous de votre projet. Nous répondons sous 24h.
        </p>

        {/* CTA principal — magnétique */}
        <button
          ref={btnRef}
          className="tc-btn group"
          style={{
            marginTop: '3rem',
            padding: '16px 48px',
            background: 'none',
            border: '1px solid rgba(255,200,100,0.28)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Fill au hover */}
          <div
            className="absolute inset-0 -translate-y-full group-hover:translate-y-0"
            style={{
              background: 'rgba(255,200,100,0.07)',
              transition: 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          <span
            className="relative"
            style={{
              fontSize: '10px',
              letterSpacing: '0.14em',
              fontFamily: 'var(--font-geist-sans)',
              color: 'rgba(255,255,255,0.50)',
              transition: 'color 250ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,200,100,0.85)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
          >
            DÉMARRER UN PROJET
          </span>
        </button>

        {/* Option alternative */}
        <div className="tc-alt mt-5 flex items-center gap-3">
          <div style={{ width: '14px', height: '1px', background: 'rgba(255,200,100,0.15)' }} />
          <span
            style={{
              fontSize: '10px',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-geist-sans)',
              color: 'rgba(255,255,255,0.18)',
              cursor: 'pointer',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}
          >
            ou nous écrire d&apos;abord
          </span>
          <div style={{ width: '14px', height: '1px', background: 'rgba(255,200,100,0.15)' }} />
        </div>

      </div>
    </section>
  )
}
