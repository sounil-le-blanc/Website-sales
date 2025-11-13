import Link from 'next/link'

export default function ResetSuccessPage() {
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
        </div>

        {/* Card confirmation */}
        <div className="bg-bandhu-card backdrop-blur-sm rounded-2xl border border-bandhu-cardBorder p-8 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">
              Mot de passe mis à jour !
            </h2>
          </div>

          <p className="text-gray-300 mb-4">
            Votre mot de passe a été réinitialisé avec succès.
          </p>
          
          <p className="text-sm text-gray-400 mb-8">
            Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
          </p>

          <Link
            href="/login"
            className="inline-block w-full px-6 py-3 bg-gradient-to-r from-bandhu-primary to-bandhu-secondary text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-bandhu-primary/30"
          >
            Se connecter
          </Link>
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