'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    num: '01',
    title: 'Sites web\nsur mesure',
    titleSmall: 'Sites web sur mesure',
    desc: 'Conception et développement de sites vitrines, portfolios et plateformes digitales. Design unique, performances optimales.',
    tag: 'Design & Développement',
  },
  {
    num: '02',
    title: 'E-commerce\n& boutiques',
    titleSmall: 'E-commerce & boutiques',
    desc: 'Boutiques en ligne pensées pour convertir — Shopify, Next.js. Expérience d\'achat premium, tunnel de vente optimisé.',
    tag: 'Commerce digital',
  },
  {
    num: '03',
    title: 'Identité\ndigitale',
    titleSmall: 'Identité digitale',
    desc: 'Direction artistique, branding, motion design. L\'identité visuelle qui vous distingue — web, print, réseaux sociaux.',
    tag: 'Branding & DA',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.sv-head', { opacity: 0 })
      gsap.set('.sv-rule', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.sv-num', { opacity: 0 })
      gsap.set('.sv-title', { opacity: 0, x: -16 })
      // Descriptions visibles par défaut — on ne les cache plus
      // Le hover les intensifie seulement
      gsap.set('.sv-desc', { opacity: 0 })
      gsap.set('.sv-tag', { opacity: 0 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 68%',
        once: true,
        onEnter() {
          const tl = gsap.timeline()
          tl.to('.sv-head', { opacity: 1, duration: 0.6, ease: 'power2.out' })
          tl.to('.sv-rule', { scaleX: 1, duration: 2.0, ease: 'expo.inOut', stagger: 0.04 }, 0.1)
          tl.to('.sv-num', { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, 0.25)
          tl.to('.sv-title', { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.3)
          // Descriptions s'affichent à l'état par défaut
          tl.to('.sv-desc', { opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.1 }, 0.55)
          tl.to('.sv-tag', { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, 0.75)
        },
      })

      // Hover : intensification uniquement
      rowRefs.current.forEach((row) => {
        if (!row) return
        const num = row.querySelector('.sv-num') as HTMLElement
        const title = row.querySelector('.sv-title') as HTMLElement
        const desc = row.querySelector('.sv-desc') as HTMLElement
        const tag = row.querySelector('.sv-tag') as HTMLElement

        row.addEventListener('mouseenter', () => {
          gsap.to(title, { color: 'rgba(255,255,255,0.88)', duration: 0.22 })
          gsap.to(num, { color: 'rgba(255,200,100,0.60)', duration: 0.22 })
          gsap.to(desc, { opacity: 1, duration: 0.22 })
          gsap.to(tag, { opacity: 1, color: 'rgba(255,200,100,0.50)', duration: 0.22 })
        })

        row.addEventListener('mouseleave', () => {
          gsap.to(title, { color: 'rgba(255,255,255,0.50)', duration: 0.28 })
          gsap.to(num, { color: 'rgba(255,255,255,0.20)', duration: 0.28 })
          gsap.to(desc, { opacity: 0.6, duration: 0.28 })
          gsap.to(tag, { color: 'rgba(255,200,100,0.30)', duration: 0.28 })
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#050508]"
      style={{ paddingTop: '12vh', paddingBottom: '14vh' }}
    >
      {/* Lumière chaude remontante — anticipe le CTA */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 pointer-events-none" style={{
        height: '55%',
        background: 'radial-gradient(ellipse 65% 75% at 20% 100%, rgba(255,195,80,0.05) 0%, transparent 65%)',
      }} />

      <div className="relative z-10" style={{
        paddingLeft: 'clamp(2rem, 5vw, 6rem)',
        paddingRight: 'clamp(2rem, 5vw, 6rem)',
      }}>

        {/* Header — une seule ligne, discret */}
        <div className="sv-head flex items-center justify-between mb-12">
          <span style={{
            fontSize: '11px', letterSpacing: '0.04em',
            fontFamily: 'var(--font-geist-sans)',
            color: 'rgba(255,255,255,0.20)',
          }}>
            Ce que nous faisons
          </span>
          <span style={{
            fontSize: '10px', letterSpacing: '0.04em',
            fontFamily: 'var(--font-geist-mono)',
            color: 'rgba(255,255,255,0.10)',
          }}>
            III
          </span>
        </div>

        {/* Services */}
        <div className="flex flex-col">
          <div className="sv-rule" style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          {SERVICES.map((srv, index) => (
            <div
              key={index}
              ref={el => { rowRefs.current[index] = el }}
              style={{ cursor: 'default' }}
            >
              <div className="flex flex-col md:flex-row md:items-center" style={{
                paddingTop: 'clamp(1.8rem, 3.5vh, 3rem)',
                paddingBottom: 'clamp(1.8rem, 3.5vh, 3rem)',
                gap: '1.5rem',
              }}>
                {/* Numéro */}
                <span className="sv-num shrink-0" style={{
                  fontSize: '10px', letterSpacing: '0.08em',
                  fontFamily: 'var(--font-geist-mono)',
                  color: 'rgba(255,255,255,0.20)',
                  width: '2.5rem', paddingTop: '0.22rem',
                }}>
                  {srv.num}
                </span>

                {/* Titre desktop */}
                <h3 className="sv-title font-display font-light hidden md:block" style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 3.2rem)',
                  letterSpacing: '-0.028em', lineHeight: 0.90,
                  color: 'rgba(255,255,255,0.50)',
                  flex: '0 0 40%', whiteSpace: 'pre-line',
                }}>
                  {srv.title}
                </h3>

                {/* Titre mobile */}
                <h3 className="sv-title font-display font-light md:hidden" style={{
                  fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
                  letterSpacing: '-0.025em', lineHeight: 0.92,
                  color: 'rgba(255,255,255,0.50)',
                }}>
                  {srv.titleSmall}
                </h3>

                {/* Desc + tag — visibles par défaut */}
                <div className="md:ml-auto flex flex-col md:items-end gap-2" style={{ maxWidth: '280px' }}>
                  <p className="sv-desc font-light md:text-right" style={{
                    fontSize: '12px', lineHeight: 1.65,
                    fontFamily: 'var(--font-geist-sans)',
                    color: 'rgba(255,255,255,0.28)',
                    letterSpacing: '0.005em',
                  }}>
                    {srv.desc}
                  </p>
                  <span className="sv-tag" style={{
                    fontSize: '9px', letterSpacing: '0.07em',
                    fontFamily: 'var(--font-geist-sans)',
                    color: 'rgba(255,200,100,0.30)',
                  }}>
                    {srv.tag}
                  </span>
                </div>
              </div>

              <div className="sv-rule" style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
