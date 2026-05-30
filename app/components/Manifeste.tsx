'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Structure asymétrique volontaire :
// - ligne 1 petite, très atténuée = mise en contexte
// - ligne 2 italic, décalée = tension
// - ligne 3 grande, pleine = résolution
const LINES = [
  {
    text: 'Un site web,',
    italic: false,
    size: 'clamp(1.6rem, 3vw, 4.2rem)',
    color: 'rgba(255,255,255,0.38)',
    indent: '0',
  },
  {
    text: "c'est votre voix.",
    italic: true,
    size: 'clamp(2.4rem, 5.5vw, 7.8rem)',
    color: 'rgba(255,255,255,0.58)',
    indent: 'clamp(3rem, 7vw, 9rem)',
  },
  {
    text: 'Faites-la résonner.',
    italic: false,
    size: 'clamp(3rem, 7.5vw, 10rem)',
    color: 'rgba(255,248,235,0.88)',
    indent: '0',
  },
]

export default function Manifeste() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Registre différent du hero : pas de yPercent clip
      // Les lignes arrivent en scale depuis 0.96 — sensation de matérialisation
      gsap.set('.m-line', { opacity: 0, scale: 0.96, transformOrigin: 'left center' })
      gsap.set('.m-body', { opacity: 0, y: 10 })
      gsap.set('.m-index', { opacity: 0 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 62%',
        once: true,
        onEnter() {
          const tl = gsap.timeline()

          // Les lignes se matérialisent — pas de slide, pas de blur
          tl.to('.m-line', {
            opacity: 1,
            scale: 1,
            duration: 1.3,
            ease: 'power3.out',
            stagger: 0.18,
          })

          tl.to('.m-body', {
            opacity: 1, y: 0,
            duration: 0.9, ease: 'power2.out',
          }, 0.6)

          tl.to('.m-index', {
            opacity: 1,
            duration: 0.5, ease: 'power1.out',
          }, 1.1)
        },
      })

      // Parallax — plus lent, plus lourd = sentiment de gravité
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate(self) {
          if (textRef.current) {
            gsap.set(textRef.current, { y: self.progress * -45 })
          }
        },
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh', backgroundColor: '#050508' }}
    >
      {/* Atmosphère : plus chaude que le hero, décalée à gauche */}
      {/* Le voyage commence ici : la lumière se déplace */}
      <div aria-hidden className="absolute pointer-events-none" style={{
        top: '10%', left: '-15%',
        width: '65vw', height: '70vh',
        background: 'radial-gradient(ellipse at 35% 45%, rgba(255,200,100,0.07) 0%, rgba(255,170,60,0.02) 50%, transparent 70%)',
      }} />

      {/* Grain identique au hero */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
        opacity: 0.05,
        mixBlendMode: 'overlay',
      }} />

      {/* Ligne verticale — continuité */}
      <div aria-hidden className="absolute left-0 inset-y-0 pointer-events-none" style={{
        width: '1px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 70%, transparent 100%)',
      }} />

      <div
        ref={textRef}
        className="relative z-10 flex flex-col justify-center"
        style={{
          minHeight: '100vh',
          paddingTop: '18vh', paddingBottom: '18vh',
          paddingLeft: 'clamp(2rem, 5vw, 6rem)',
          paddingRight: 'clamp(2rem, 5vw, 6rem)',
        }}
      >

        {/* Statement — sans label, sans règle décorative répétée */}
        {/* La typographie suffit */}
        <div className="flex flex-col" style={{ gap: '0.06em' }}>
          {LINES.map(({ text, italic, size, color, indent }, i) => (
            <div key={i} className="m-line" style={{ paddingLeft: indent }}>
              <p
                className={`font-display font-light${italic ? ' italic' : ''}`}
                style={{
                  fontSize: size,
                  lineHeight: 0.89,
                  letterSpacing: '-0.028em',
                  color,
                  display: 'block',
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Corps de texte — ancrage concret */}
        <div className="m-body mt-14 flex flex-col gap-6" style={{ maxWidth: '360px' }}>
          <div style={{ width: '32px', height: '1px', background: 'rgba(255,200,100,0.28)' }} />
          <p style={{
            fontSize: '13px',
            lineHeight: 1.75,
            letterSpacing: '0.005em',
            fontFamily: 'var(--font-geist-sans)',
            color: 'rgba(255,255,255,0.28)',
          }}>
            Nous concevons des sites qui travaillent pour vous — esthétiquement irréprochables,
            techniquement solides, pensés pour convertir.
          </p>
        </div>

        {/* Index section — remplace le compteur générique */}
        <div className="m-index" style={{
          position: 'absolute',
          bottom: 'clamp(2rem, 4vh, 4rem)',
          right: 'clamp(2rem, 5vw, 6rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{ width: '16px', height: '1px', background: 'rgba(255,200,100,0.18)' }} />
          <span style={{
            fontSize: '10px',
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-geist-mono)',
            color: 'rgba(255,255,255,0.15)',
          }}>
            II
          </span>
        </div>

      </div>
    </section>
  )
}
