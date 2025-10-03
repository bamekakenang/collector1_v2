'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', name: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setLoading(false)
    if (res.ok) router.push('/auth/signin')
    else alert('Impossible de créer le compte')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>
      <form onSubmit={submit} className="space-y-4">
        <input type="text" placeholder="Nom" className="w-full rounded-md border px-3 py-2" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" className="w-full rounded-md border px-3 py-2" value={form.email} onChange={e=>setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Mot de passe" className="w-full rounded-md border px-3 py-2" value={form.password} onChange={e=>setForm({ ...form, password: e.target.value })} required />
        <button className="rounded-md bg-brand text-white px-4 py-2 font-medium hover:bg-brand-dark disabled:opacity-50" disabled={loading}>
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
      </form>
    </div>
  )
}
