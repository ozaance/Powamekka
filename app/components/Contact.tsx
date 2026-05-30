'use client'

import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section
      id="contact"
      className="py-28 px-6"
      style={{ background: 'rgba(245,242,235,0.6)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#c9a96e]" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#8c6621]">
              Consultation gratuite
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 font-display">
            Parlons de votre projet
          </h2>
          <p className="text-sm text-[#110D0B]/60 max-w-md mx-auto">
            Réponse sous 24 h. Étude de mots-clés offerte dès le premier échange.
          </p>
        </div>

        {sent ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)' }}
          >
            <p className="text-2xl mb-2">✓</p>
            <p className="text-sm font-medium text-neutral-800">Message bien reçu !</p>
            <p className="text-xs text-[#110D0B]/50 mt-1">Nous vous répondons dans les 24 heures.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#110D0B]/50 mb-1.5 font-mono tracking-wide">Nom & Prénom *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 rounded-xl text-sm text-neutral-900 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    fontFamily: 'var(--font-geist-sans)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
                />
              </div>
              <div>
                <label className="block text-xs text-[#110D0B]/50 mb-1.5 font-mono tracking-wide">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  className="w-full px-4 py-3 rounded-xl text-sm text-neutral-900 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    fontFamily: 'var(--font-geist-sans)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#110D0B]/50 mb-1.5 font-mono tracking-wide">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jean@entreprise.fr"
                className="w-full px-4 py-3 rounded-xl text-sm text-neutral-900 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  fontFamily: 'var(--font-geist-sans)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
              />
            </div>

            <div>
              <label className="block text-xs text-[#110D0B]/50 mb-1.5 font-mono tracking-wide">Votre projet</label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Je suis menuisier à Montpellier et je cherche à développer ma clientèle..."
                className="w-full px-4 py-3 rounded-xl text-sm text-neutral-900 outline-none resize-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  fontFamily: 'var(--font-geist-sans)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-300 bg-neutral-900 text-white hover:bg-neutral-700"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Envoyer ma demande
            </button>

            <p className="text-[10px] text-center text-[#110D0B]/30" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Vos données sont confidentielles et ne seront jamais partagées.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
