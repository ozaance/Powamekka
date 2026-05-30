'use client'

import { useEffect, useRef, useState } from 'react'

const NAV = ['Projets', 'À propos', 'Contact']

// ─── Sphère Three.js (desktop uniquement) ──────────────────────────
function SphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let animId: number
    let isActive = true
    let renderer: any, scene: any, earthGroup: any, earthMesh: any, cloudsMesh: any

    const init = async () => {
      const canvas = canvasRef.current
      if (!canvas) return
      if (window.innerWidth < 768 || /Mobi/i.test(navigator.userAgent)) return

      const THREE = await import('three')

      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
        renderer.setClearColor(0x000000, 0)
      } catch {
        return
      }

      scene = new THREE.Scene()
      earthGroup = new THREE.Group()
      scene.add(earthGroup)

      const camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100)
      camera.position.z = 2.8

      const loader = new THREE.TextureLoader()
      const colorMap = loader.load('/textures/earth_color.jpg')
      const cloudsMap = loader.load('/textures/earth_clouds.png')
      const normalMap = loader.load('/textures/earth_normal.jpg')

      const earthMat = new THREE.MeshStandardMaterial({
        map: colorMap, normalMap,
        normalScale: new THREE.Vector2(0.8, 0.8),
        roughness: 0.55, metalness: 0.05,
      })
      earthMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), earthMat)
      earthMesh.rotation.y = -0.6
      earthGroup.add(earthMesh)

      cloudsMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.01, 48, 48),
        new THREE.MeshPhongMaterial({ map: cloudsMap, transparent: true, opacity: 0.18, depthWrite: false })
      )
      earthGroup.add(cloudsMesh)

      earthGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.06, 48, 48),
        new THREE.MeshBasicMaterial({ color: new THREE.Color('#1a3a6a'), transparent: true, opacity: 0.12, side: THREE.BackSide })
      ))

      const sun = new THREE.DirectionalLight(0xfffff8f0, 1.6)
      sun.position.set(-4, 0.5, 1.5)
      scene.add(sun)
      scene.add(new THREE.AmbientLight(0xffffff, 0.08))
      scene.add(new THREE.HemisphereLight(0x0a0a1a, 0x000000, 0.12))

      let autoY = -0.6, autoCY = 0
      let tRX = 0, tRY = 0, cRX = 0, cRY = 0

      const onMouse = (e: MouseEvent) => {
        tRY = (e.clientX / window.innerWidth - 0.5) * 0.20
        tRX = -(e.clientY / window.innerHeight - 0.5) * 0.14
      }
      window.addEventListener('mousemove', onMouse, { passive: true })

      const onResize = () => {
        const w = canvas.offsetWidth, h = canvas.offsetHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer?.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      // Scroll natif — pas de GSAP ScrollTrigger
      const onScroll = () => {
        if (!earthGroup || !canvas) return
        const p = Math.min(window.scrollY / (window.innerHeight * 0.55), 1)
        earthGroup.position.y = p * 1.0
        earthGroup.scale.setScalar(1 - p * 0.30)
        canvas.style.opacity = String(1 - p)
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      const animate = () => {
        if (!isActive) return
        animId = requestAnimationFrame(animate)
        autoY += 0.0005; autoCY += 0.0008
        earthMesh.rotation.y = autoY
        cloudsMesh.rotation.y = autoCY
        cRX += (tRX - cRX) * 0.02; cRY += (tRY - cRY) * 0.02
        earthGroup.rotation.y = cRY; earthGroup.rotation.x = cRX
        renderer.render(scene, camera)
      }
      animate()

      const onVisibility = () => {
        if (document.hidden) { isActive = false; cancelAnimationFrame(animId) }
        else { isActive = true; animate() }
      }
      document.addEventListener('visibilitychange', onVisibility)

      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { if (!isActive) { isActive = true; animate() } }
        else { isActive = false; cancelAnimationFrame(animId) }
      }, { threshold: 0.1 })
      obs.observe(canvas)

      return () => {
        isActive = false
        window.removeEventListener('mousemove', onMouse)
        window.removeEventListener('resize', onResize)
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('visibilitychange', onVisibility)
        cancelAnimationFrame(animId)
        obs.disconnect()
        renderer?.dispose()
      }
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()); cancelAnimationFrame(animId) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute hidden md:block"
      style={{
        right: '-8vw', top: '42%', transform: 'translateY(-50%)',
        width: 'clamp(380px, 48vw, 700px)',
        height: 'clamp(380px, 48vw, 700px)',
        pointerEvents: 'none', zIndex: 1,
      }}
    />
  )
}

// ─── Hero ──────────────────────────────────────────────────────────
export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState('')

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
      <SphereCanvas />

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
            <h1 className="font-display font-light" style={{
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
