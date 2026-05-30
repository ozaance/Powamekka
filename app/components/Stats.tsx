'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: '10', sup: '+', label: 'Sites livrés', sub: 'projets réalisés' },
  { value: '98', sup: '%', label: 'Satisfaction client', sub: 'taux de fidélisation' },
  { value: '72', sup: 'h', label: 'Première livraison', sub: 'délai moyen' },
]

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.sn-num', { opacity: 0, yPercent: -50 })
      gsap.set('.sn-label', { opacity: 0 })
      gsap.set('.sn-rule-h', { scaleX: 0, transformOrigin: 'left center' })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
        onEnter() {
          const tl = gsap.timeline()
          // Règle unique en haut — grandit de gauche à droite
          tl.to('.sn-rule-h', { scaleX: 1, duration: 1.8, ease: 'expo.inOut' })
          // Chiffres tombent depuis le haut, staggerés
          tl.to('.sn-num', {
            opacity: 1, yPercent: 0,
            duration: 1.0, ease: 'power3.out', stagger: 0.15,
          }, 0.25)
          tl.to('.sn-label', {
            opacity: 1,
            duration: 0.7, ease: 'power2.out', stagger: 0.12,
          }, 0.55)
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#050508]"
      style={{ paddingTop: '13vh', paddingBottom: '13vh' }}
    >
      {/* Atmosphère froide — transition depuis le Manifeste chaud */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 55% at 85% 40%, rgba(160,185,255,0.028) 0%, transparent 65%)',
      }} />

      <div className="relative z-10" style={{
        paddingLeft: 'clamp(2rem, 5vw, 6rem)',
        paddingRight: 'clamp(2rem, 5vw, 6rem)',
      }}>

        {/* Règle horizontale unique — pas de boîtes */}
        <div className="sn-rule-h mb-0" style={{
          height: '1px',
          background: 'linear-gradient(to right, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 65%, transparent)',
        }} />

        {/* Trois stats en colonnes — séparées par des règles verticales, pas des borders */}
        <div className="flex flex-col md:flex-row">
          {STATS.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col"
              style={{
                paddingTop: 'clamp(2.5rem, 5vh, 4.5rem)',
                paddingBottom: 'clamp(2.5rem, 5vh, 4.5rem)',
                paddingRight: index < STATS.length - 1 ? 'clamp(2rem, 5vw, 5rem)' : 0,
                paddingLeft: index > 0 ? 'clamp(2rem, 5vw, 5rem)' : 0,
                // Séparateur vertical subtil — ligne, pas border de box
                borderRight: index < STATS.length - 1
                  ? '1px solid rgba(255,255,255,0.04)'
                  : 'none',
              }}
            >
              {/* Nombre — taille croissante réelle */}
              <div style={{ overflow: 'hidden', marginBottom: '0.4em' }}>
                <div className="sn-num flex items-baseline gap-1" style={{ lineHeight: 0.80 }}>
                  <span className="font-display font-light" style={{
                    // Progression marquée : 40+ petit, 98% moyen, 72h grand
                    fontSize: index === 0
                      ? 'clamp(3.5rem, 7vw, 9rem)'
                      : index === 1
                      ? 'clamp(5rem, 10vw, 13rem)'
                      : 'clamp(6rem, 12vw, 16rem)',
                    letterSpacing: '-0.055em',
                    lineHeight: 0.80,
                    color: 'rgba(255,255,255,0.80)',
                  }}>
                    {item.value}
                  </span>
                  <span className="font-display font-light" style={{
                    fontSize: index === 0
                      ? 'clamp(1.8rem, 3.5vw, 4.5rem)'
                      : index === 1
                      ? 'clamp(2.5rem, 5vw, 6.5rem)'
                      : 'clamp(3rem, 6vw, 8rem)',
                    letterSpacing: '-0.04em',
                    color: 'rgba(255,200,100,0.48)',
                    lineHeight: 1,
                  }}>
                    {item.sup}
                  </span>
                </div>
              </div>

              {/* Labels */}
              <div className="sn-label flex flex-col gap-1.5">
                <span className="font-display font-light italic" style={{
                  fontSize: 'clamp(0.9rem, 1.15vw, 1.05rem)',
                  letterSpacing: '-0.01em',
                  color: 'rgba(255,255,255,0.38)',
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: '10px',
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-geist-sans)',
                  color: 'rgba(255,255,255,0.15)',
                }}>
                  {item.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Règle basse */}
        <div className="sn-rule-h" style={{
          height: '1px',
          background: 'linear-gradient(to right, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 65%, transparent)',
        }} />

      </div>
    </section>
  )
}
