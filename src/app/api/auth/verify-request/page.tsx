import Link from 'next/link'

export default function VerifyRequest() {
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
            <div className="inline-block p-4 bg-bandhu-primary/10 rounded-full mb-4">
              <span className="text-5xl">📧</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Vérifie tes mails !
            </h2>
          </div>

          <p className="text-gray-300 mb-4 text-lg">
            Un email de vérification a été envoyé à ton adresse.
          </p>
          
          <p className="text-gray-300 mb-6">
            Clique sur le lien dans l'email pour activer ton compte.
          </p>

          <p className="text-sm text-gray-500">
            Pas reçu ? Vérifie tes spams ou réessaie dans quelques minutes.
          </p>
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