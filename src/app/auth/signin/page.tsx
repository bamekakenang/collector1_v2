'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn('credentials', { redirect: true, email, password, callbackUrl: '/' })
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Se connecter</h1>
      <form onSubmit={submit} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full rounded-md border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" className="w-full rounded-md border px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="rounded-md bg-brand text-white px-4 py-2 font-medium hover:bg-brand-dark disabled:opacity-50" disabled={loading}>
          {loading ? 'Connexion...' : 'Connexion'}
        </button>
      </form>
      <p className="text-sm text-zinc-600 mt-4">Pas de compte ? <Link href="/auth/signup" className="text-brand underline">Créer un compte</Link></p>
    </div>
  )
}
