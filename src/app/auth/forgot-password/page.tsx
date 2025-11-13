'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (data.success) {
        router.push('/auth/reset-sent')
      } else {
        setError(data.error || 'Erreur lors de l\'envoi')
      }
    } catch (error) {
      setError('Erreur de connexion')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bandhu-dark via-gray-900 to-bandhu-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Titre */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-bandhu-primary via-bandhu-secondary to-bandhu-primary bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform">
              Bandhu
            </h1>
          </Link>
          <p className="text-gray-400 mt-2">Réinitialisation du mot de passe</p>
        </div>

        {/* Formulaire */}
        <div className="bg-bandhu-card backdrop-blur-sm rounded-2xl border border-bandhu-cardBorder p-8">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Mot de passe oublié ?
          </h2>
          <p className="text-gray-400 text-sm mb-6 text-center">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bandhu-primary focus:border-transparent transition"
                placeholder="votre@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-bandhu-primary to-bandhu-secondary text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-bandhu-primary/30"
            >
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>

          {/* Retour connexion */}
          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-sm text-bandhu-primary hover:text-bandhu-secondary transition"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>

        {/* Retour accueil */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-gray-400 hover:text-bandhu-primary transition text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}