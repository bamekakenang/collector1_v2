'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddToCart({ productId }: { productId: string }) {
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function add() {
    setLoading(true)
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: qty })
    })
    setLoading(false)
    if (res.ok) router.push('/cart')
    else if (res.status === 401) router.push('/auth/signin')
    else alert('Erreur panier')
  }

  return (
    <div className="flex items-center gap-3">
      <input type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value || '1', 10))}
             className="w-24 rounded-md border px-3 py-2" />
      <button onClick={add} disabled={loading} className="rounded-md bg-brand text-white px-4 py-2 font-medium hover:bg-brand-dark disabled:opacity-50">
        {loading ? 'Ajout...' : 'Ajouter au panier'}
      </button>
    </div>
  )
}
