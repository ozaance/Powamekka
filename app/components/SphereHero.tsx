'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV = ['Projets', 'À propos', 'Contact']

// ─── Sphère/Terre Three.js ─────────────────────────────────────────
// Chargée dynamiquement pour éviter le SSR crash
export function SphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let animId: number
    let renderer: any, scene: any, camera: any, earthGroup: any, earthMesh: any, cloudsMesh: any, atmosMesh: any
    let scrollTriggerInstance: any

    const init = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      if (window.innerWidth < 768 || /Mobi/i.test(navigator.userAgent)) return

      const THREE = await import('three')
      const segments = 48

      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
        renderer.setClearColor(0x000000, 0)
      } catch (error) {
        console.error('WebGL is not supported in this environment:', error)
        return
      }

      scene = new THREE.Scene()
      earthGroup = new THREE.Group()
      scene.add(earthGroup)

      camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100)
      camera.position.z = 2.8

      const textureLoader = new THREE.TextureLoader()

      const colorMap = textureLoader.load('/textures/earth_color.jpg')
      const cloudsMap = textureLoader.load('/textures/earth_clouds.png')

      const earthGeo = new THREE.SphereGeometry(1, segments, segments)
      const earthMat = new THREE.MeshStandardMaterial({
        map: colorMap,
        roughness: 0.55,
        metalness: 0.05,
      })

      const normalMap = textureLoader.load('/textures/earth_normal.jpg')
      earthMat.normalMap = normalMap
      earthMat.normalScale = new THREE.Vector2(0.8, 0.8)

      earthMesh = new THREE.Mesh(earthGeo, earthMat)
      earthMesh.rotation.y = -0.6
      earthGroup.add(earthMesh)

      const cloudsGeo = new THREE.SphereGeometry(1.01, segments, segments)
      const cloudsMat = new THREE.MeshPhongMaterial({
        map: cloudsMap,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      })

      cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat)
      earthGroup.add(cloudsMesh)

      const atmosGeo = new THREE.SphereGeometry(1.06, segments, segments)
      const atmosMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#1a3a6a'),
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      })

      atmosMesh = new THREE.Mesh(atmosGeo, atmosMat)
      earthGroup.add(atmosMesh)

      const sunLight = new THREE.DirectionalLight(0xfffff8f0, 1.6)
      sunLight.position.set(-4, 0.5, 1.5)
      scene.add(sunLight)

      const ambient = new THREE.AmbientLight(0xffffff, 0.08)
      scene.add(ambient)

      const hemiLight = new THREE.HemisphereLight(0x0a0a1a, 0x000000, 0.12)
      scene.add(hemiLight)

      let autoRotEarthY = -0.6
      let autoRotCloudsY = 0
      let targetRotX = 0
      let targetRotY = 0
      let currentRotX = 0
      let currentRotY = 0
      let isActive = true

      const onMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5)
        const y = (e.clientY / window.innerHeight - 0.5)
        targetRotY = x * 0.20
        targetRotX = -y * 0.14
      }
      window.addEventListener('mousemove', onMouseMove, { passive: true })

      const onResize = () => {
        if (!canvas) return
        const w = canvas.offsetWidth
        const h = canvas.offsetHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        if (renderer) renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      const animate = () => {
        if (!isActive) return
        animId = requestAnimationFrame(animate)

        autoRotEarthY += 0.0005
        autoRotCloudsY += 0.0008
        earthMesh.rotation.y = autoRotEarthY
        cloudsMesh.rotation.y = autoRotCloudsY

        currentRotX += (targetRotX - currentRotX) * 0.02
        currentRotY += (targetRotY - currentRotY) * 0.02
        earthGroup.rotation.y = currentRotY
        earthGroup.rotation.x = currentRotX

        if (renderer) renderer.render(scene, camera)
      }
      animate()

      const onVisibilityChange = () => {
        if (document.hidden) {
          isActive = false
          cancelAnimationFrame(animId)
        } else {
          isActive = true
          animate()
        }
      }
      document.addEventListener('visibilitychange', onVisibilityChange)

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (!isActive) { isActive = true; animate() }
          } else {
            isActive = false
            cancelAnimationFrame(animId)
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(canvas)

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: '+=55%',
        scrub: 2.5,
        onUpdate(self) {
          if (earthGroup) {
            earthGroup.position.y = self.progress * 1.0
            earthGroup.scale.setScalar(1 - self.progress * 0.30)
            if (canvas) canvas.style.opacity = String(1 - self.progress)
          }
        },
      })

      return () => {
        isActive = false
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVisibilityChange)
        cancelAnimationFrame(animId)
        observer.disconnect()
        if (scrollTriggerInstance) scrollTriggerInstance.kill()
        if (renderer) renderer.dispose()
      }
    }

    const cleanup = init()
    return () => {
      cleanup.then(fn => fn?.())
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute"
      style={{
        right: '-8vw',
        top: '42%',
        transform: 'translateY(-50%)',
        width: 'clamp(380px, 48vw, 700px)',
        height: 'clamp(380px, 48vw, 700px)',
        pointerEvents: 'none',
        opacity: 1.0,
        zIndex: 1,
      }}
    />
  )
}

// ─── SphereHero ────────────────────────────────────────────────────
export default function SphereHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('fr-FR', {
        timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false,
      }))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.h-nav', { opacity: 0 })
      gsap.set('.h-line1', { opacity: 0, yPercent: 108 })
      gsap.set('.h-line2', { opacity: 0, yPercent: 108 })
      gsap.set('.h-rule', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.h-meta', { opacity: 0 })
      gsap.set('.h-foot', { opacity: 0 })

      const tl = gsap.timeline({ delay: 0.2 })

      tl.to('.h-nav', { opacity: 1, duration: 0.7, ease: 'power2.out' })
      tl.to('.h-rule', { scaleX: 1, duration: 1.2, ease: 'expo.inOut' }, 0.3)
      tl.to('.h-line1', { opacity: 1, yPercent: 0, duration: 1.1, ease: 'power3.out' }, 0.35)
      tl.to('.h-line2', { opacity: 1, yPercent: 0, duration: 1.3, ease: 'power3.out' }, 0.5)
      tl.to('.h-meta', { opacity: 1, duration: 0.9, ease: 'power2.out', stagger: 0.1 }, 0.85)
      tl.to('.h-foot', { opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.08 }, 1.1)

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=70%',
        scrub: 2,
        onUpdate(self) {
          if (contentRef.current) {
            gsap.set(contentRef.current, {
              y: self.progress * -40,
              opacity: 1 - self.progress * 0.8,
            })
          }
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#050508' }}
    >
      {/* Sphère Three.js */}
      <SphereCanvas />

      {/* Lumière ambiante gauche — crée la profondeur contre la sphère */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 70% at 0% 65%, rgba(255,205,120,0.06) 0%, transparent 60%)',
      }} />

      {/* Grain */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.72\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')",
        backgroundSize: '256px 256px',
        opacity: 0.045,
        mixBlendMode: 'overlay',
      }} />

      {/* Ligne verticale gauche */}
      <div aria-hidden className="absolute left-0 inset-y-0 pointer-events-none" style={{
        width: '1px',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.05) 15%, rgba(255,255,255,0.05) 85%, transparent 100%)',
      }} />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col h-full justify-between"
        style={{ paddingLeft: 'clamp(2rem, 5vw, 6rem)', paddingRight: 'clamp(2rem, 5vw, 6rem)' }}
      >
        {/* NAV */}
        <nav className="h-nav flex justify-between items-center pt-9">
          <div className="flex items-center gap-2.5">
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,205,120,0.55)' }} />
            <span style={{ fontSize: '11px', letterSpacing: '0.06em', fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.42)' }}>
              Studio
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <button key={item} style={{
                fontSize: '11px', letterSpacing: '0.025em',
                fontFamily: 'var(--font-geist-sans)',
                color: 'rgba(255,255,255,0.20)',
                background: 'none', border: 'none',
                transition: 'color 220ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.20)')}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>

        {/* HEADLINE — ancré en bas, laisse la sphère respirer en haut */}
        <div className="flex-1 flex flex-col justify-end" style={{ paddingBottom: 'clamp(5rem, 14vh, 9rem)' }}>

          {/* Règle dorée */}
          <div className="h-rule" style={{
            width: '52px', height: '1.5px',
            background: 'rgba(255,200,100,0.55)',
            marginBottom: '1.5rem',
          }} />

          {/* Ligne 1 — "Sites web" — grande */}
          <div style={{ overflow: 'hidden' }}>
            <h1 className="h-line1 font-display font-light" style={{
              fontSize: 'clamp(4rem, 12.5vw, 16rem)',
              letterSpacing: '-0.05em',
              lineHeight: 0.83,
              color: 'rgba(255,255,255,0.87)',
              display: 'block',
            }}>
              Sites web
            </h1>
          </div>

          {/* Ligne 2 — "qui marquent." — plus petite, italic, or */}
          <div style={{ overflow: 'hidden' }}>
            <h1 className="h-line2 font-display italic font-light" style={{
              fontSize: 'clamp(2rem, 6.5vw, 8.5rem)',
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              color: 'rgba(255,195,90,0.42)',
              display: 'block',
              paddingLeft: 'clamp(0.5rem, 1.2vw, 1.5rem)',
            }}>
              qui marquent.
            </h1>
          </div>

          {/* Méta — description courte + CTA */}
          <div className="flex justify-between items-baseline" style={{ marginTop: '2rem' }}>
            {/* Description — Design & développement — Paris. */}
            <p className="h-meta" style={{
              fontSize: '12px',
              fontFamily: 'var(--font-geist-sans)',
              color: 'rgba(255,255,255,0.28)',
              maxWidth: 'none',
              letterSpacing: '0.02em',
              margin: 0,
            }}>
              Design & développement — Paris.
            </p>

            {/* CTA — visible, élégant */}
            <button
              className="h-meta group flex items-center gap-3"
              style={{ background: 'none', border: 'none', flexShrink: 0, cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => {
                const span = e.currentTarget.querySelector('span');
                const line = e.currentTarget.querySelector('div');
                if (span) span.style.color = 'rgba(255,200,100,0.85)';
                if (line) {
                  line.style.background = 'rgba(255,200,100,0.85)';
                  line.style.width = '44px';
                }
              }}
              onMouseLeave={e => {
                const span = e.currentTarget.querySelector('span');
                const line = e.currentTarget.querySelector('div');
                if (span) span.style.color = 'rgba(255,255,255,0.32)';
                if (line) {
                  line.style.background = 'rgba(250,200,100,0.40)';
                  line.style.width = '28px';
                }
              }}
            >
              <span style={{
                fontSize: '10px',
                letterSpacing: '0.14em',
                fontFamily: 'var(--font-geist-sans)',
                color: 'rgba(255,255,255,0.32)',
                transition: 'color 220ms ease',
              }}>
                DÉMARRER
              </span>
              <div style={{
                width: '28px', height: '1px',
                background: 'rgba(255,200,100,0.40)',
                transition: 'width 280ms ease, background 220ms ease',
              }} />
            </button>
          </div>
        </div>

        {/* PIED */}
        <div className="flex justify-between items-end pb-7">
          {/* Scroll indicator */}
          <div className="h-foot flex items-center gap-0">
            <div className="relative overflow-hidden" style={{
              width: '1px', height: '38px',
              background: 'rgba(255,255,255,0.07)',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '45%',
                background: 'rgba(255,205,120,0.55)',
                animation: 'sP 2.6s ease-in-out infinite',
              }} />
            </div>
          </div>

          {/* Heure */}
          <div className="h-foot text-right">
            <div style={{ fontSize: '9px', letterSpacing: '0.05em', fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.10)' }}>
              Paris
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '0.04em', fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.26)' }}>
              {time}
            </div>
          </div>
        </div>
      </div>

      <style>{`
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
