"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [token, setToken] = useState("")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  
  useEffect(() => {
    // Récupère le token depuis l'URL
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      
      // 🔥 AJOUTE LA VÉRIFICATION :
      fetch("/api/verifyemail", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: tokenFromUrl }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus("success")
      
        } else {
          setStatus("error")
        }
      })
      .catch(err => {
        console.error(err)
        setStatus("error")
      })
    }
  }, [])
  
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

        {/* Card status */}
        <div className="bg-bandhu-card backdrop-blur-sm rounded-2xl border border-bandhu-cardBorder p-8 text-center">
          {status === "loading" && (
            <div>
              <div className="inline-block p-4 bg-bandhu-primary/10 rounded-full mb-4 animate-pulse">
                <span className="text-5xl">⏳</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Vérification en cours...
              </h2>
              <p className="text-gray-400 text-sm">
                Veuillez patienter quelques instants
              </p>
            </div>
          )}

          {status === "success" && (
  <div>
    <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
      <span className="text-5xl">✅</span>
    </div>
    <h2 className="text-2xl font-bold text-green-400 mb-2">
      Email vérifié avec succès !
    </h2>
    <p className="text-gray-400 text-sm mb-6">
      Votre compte est maintenant actif
    </p>
   <Link
  href="/login"
  className="inline-block w-full px-6 py-3 bg-gradient-to-r from-bandhu-primary to-bandhu-secondary text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-bandhu-primary/30"
>
  Se connecter
</Link>
  </div>
)}

          {status === "error" && (
            <div>
              <div className="inline-block p-4 bg-red-500/10 rounded-full mb-4">
                <span className="text-5xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">
                Erreur de vérification
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Le lien est invalide ou a expiré
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-gradient-to-r from-bandhu-primary to-bandhu-secondary text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-bandhu-primary/30"
              >
                Retour à la connexion
              </Link>
            </div>
          )}
        </div>

        {/* Debug token (enlève en prod) */}
        {token && (
          <p className="text-xs text-gray-600 text-center mt-4">
            Token: {token.substring(0, 20)}...
          </p>
        )}
      </div>
    </div>
  )
}