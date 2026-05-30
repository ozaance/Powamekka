'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(5, 5, 8, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-light tracking-tight text-white/88 hover:text-white transition-colors"
          style={{ fontSize: 'clamp(1rem, 1.3vw, 1.1rem)' }}
        >
          Powamekka
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: '/creation-site/plombier/paris', label: 'Nos services' },
            { href: '/blog', label: 'Blog' },
            { href: '#contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-xs tracking-wide text-white/40 hover:text-white/80 transition-colors duration-200"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <a
          href="#contact"
          className="px-5 py-2 rounded-full text-xs font-medium transition-all duration-300"
          style={{
            fontFamily: 'var(--font-geist-sans)',
            background: 'rgba(255, 200, 100, 0.08)',
            border: '1px solid rgba(255, 200, 100, 0.28)',
            color: 'rgba(255, 255, 255, 0.8)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 200, 100, 0.14)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 200, 100, 0.08)'
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
          }}
        >
          Devis gratuit
        </a>
      </div>
    </header>
  )
}
