'use client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const { data: session } = useSession()
  const router = useRouter()
  
  if (!session) return null
  
  return (
    <button
      onClick={async () => {
        await signOut({ redirect: false })
        router.push('/')
        router.refresh()
      }}
      className="fixed top-4 right-4 px-4 py-2 bg-gradient-to-br from-blue-900/90 to-ble-700/90 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-lg z-50"
    >
      Se déconnecter
    </button>
  )
}