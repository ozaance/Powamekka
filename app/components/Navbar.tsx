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
          ? 'rgba(245, 242, 235, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-light tracking-tight text-neutral-900"
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
              className="text-xs tracking-wide text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <a
          href="#contact"
          className="px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 bg-neutral-900 text-white hover:bg-neutral-700"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Devis gratuit
        </a>
      </div>
    </header>
  )
}
