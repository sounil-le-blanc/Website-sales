'use client'

import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 🚀 Redirige si connecté
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/chat')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value

    const res = await signIn(isLogin ? 'login' : 'register', {
      email,
      password,
      name,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      if (isLogin) {
        // 🔥 Messages LOGIN
        if (res.error === 'EMAIL_NOT_VERIFIED') {
          setError('📧 Votre email n\'est pas encore vérifié. Consultez votre boîte mail.')
        } else if (res.error === 'INVALID_PASSWORD') {
          setError('❌ Mot de passe incorrect.')
        } else if (res.error === 'EMAIL_NOT_REGISTERED') {
          setError('❌ Aucun compte trouvé avec cet email.')
        } else if (res.error === 'INVALID_EMAIL_FORMAT') {
          setError('❌ Format d\'email invalide.')
        } else if (res.error === 'MISSING_FIELDS') {
          setError('❌ Veuillez remplir tous les champs.')
        } else {
          setError('❌ Erreur de connexion.')
        }
      } else {
        // 🔥 Messages REGISTER
        if (res.error === 'USER_ALREADY_EXISTS') {
          setError('⚠️ Un compte existe déjà avec cet email.')
        } else if (res.error === 'INVALID_EMAIL_FORMAT') {
          setError('❌ Format d\'email invalide.')
        } else if (res.error === 'INVALID_PASSWORD_FORMAT') {
          setError('❌ Le mot de passe doit contenir au moins 6 caractères.')
        } else if (res.error === 'MISSING_FIELDS') {
          setError('❌ Veuillez remplir tous les champs.')
        } else {
          router.push('/api/auth/verify-request')
        }
      }
    } else {
      // 🔥 PAS D'ERREUR = SUCCÈS
      if (isLogin) {
        router.push('/chat')  
      } else {
        router.push('/api/auth/verify-request')
      }
    }
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
          <p className="text-gray-400 mt-2">
            {isLogin ? 'Connexion à votre espace' : 'Créer votre compte'}
          </p>
        </div>

        {/* Tabs Login/Register */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              isLogin
                ? 'bg-gradient-to-r from-bandhu-primary to-bandhu-secondary text-white shadow-lg shadow-bandhu-primary/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              !isLogin
                ? 'bg-gradient-to-r from-bandhu-primary to-bandhu-secondary text-white shadow-lg shadow-bandhu-primary/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <div className="bg-bandhu-card backdrop-blur-sm rounded-2xl border border-bandhu-cardBorder p-8">
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
                name="email"
                type="email"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bandhu-primary focus:border-transparent transition"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bandhu-primary focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom
                </label>
                <input
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bandhu-primary focus:border-transparent transition"
                  placeholder="Votre nom"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-bandhu-primary to-bandhu-secondary text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-bandhu-primary/30"
            >
              {loading ? 'En cours...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </form>

          {/* Mot de passe oublié */}
          {isLogin && (
            <div className="text-center mt-6">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-bandhu-primary hover:text-bandhu-secondary transition"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          )}
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