'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductForm() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priceCents: 0, imageUrl: '' })
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setLoading(false)
    if (res.ok) router.push('/')
    else alert('Erreur lors de la publication')
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium">Titre</label>
        <input className="mt-1 w-full rounded-md border px-3 py-2" required
               value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={4} required
               value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium">Prix (€)</label>
        <input type="number" min="0" className="mt-1 w-full rounded-md border px-3 py-2" required
               value={form.priceCents/100} onChange={e => setForm({ ...form, priceCents: Math.round(parseFloat(e.target.value||'0')*100) })} />
      </div>
      <div>
        <label className="block text-sm font-medium">Image (URL)</label>
        <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="https://..." 
               value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
        <p className="text-xs text-zinc-500 mt-1">Astuce: collez une URL d&apos;image (hébergeur ou placeholder) pour un rendu soigné.</p>
      </div>
      <button disabled={loading} className="rounded-md bg-brand text-white px-4 py-2 font-medium hover:bg-brand-dark disabled:opacity-50">
        {loading ? 'Publication...' : 'Publier'}
      </button>
    </form>
  )
}
