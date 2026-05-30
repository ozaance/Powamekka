'use client'

import { useEffect, useRef } from 'react'

export default function SphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let animId: number
    let isActive = true
    let renderer: any, scene: any, earthGroup: any, earthMesh: any, cloudsMesh: any
    let initialized = false

    const init = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

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

    let cleanup: Promise<(() => void) | undefined>

    const initOnInteraction = () => {
      if (initialized) return
      initialized = true
      cleanup = init()
      window.removeEventListener('mousemove', initOnInteraction)
      window.removeEventListener('scroll', initOnInteraction)
      window.removeEventListener('touchstart', initOnInteraction)
    }

    const timer = setTimeout(initOnInteraction, 2000)
    window.addEventListener('mousemove', initOnInteraction, { passive: true, once: true })
    window.addEventListener('scroll', initOnInteraction, { passive: true, once: true })
    window.addEventListener('touchstart', initOnInteraction, { passive: true, once: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', initOnInteraction)
      window.removeEventListener('scroll', initOnInteraction)
      window.removeEventListener('touchstart', initOnInteraction)
      cleanup?.then(fn => fn?.())
      cancelAnimationFrame(animId)
    }
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
