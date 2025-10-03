import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default async function CartPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return <div><p>Veuillez vous <Link href="/auth/signin" className="text-brand underline">connecter</Link> pour accéder à votre panier.</p></div>
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { cart: { include: { product: true } } } })
  const items = user?.cart ?? []
  const total = items.reduce((acc, it) => acc + it.quantity * it.product.priceCents, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Votre panier</h1>
      {items.length === 0 && <p>Panier vide.</p>}
      <div className="space-y-4">
        {items.map(it => (
          <div key={it.id} className="flex items-center justify-between border rounded-xl p-4 bg-white">
            <div>
              <p className="font-medium">{it.product.title}</p>
              <p className="text-sm text-zinc-600">Qté: {it.quantity}</p>
            </div>
            <div className="font-semibold">{formatPrice(it.quantity * it.product.priceCents)}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-lg font-medium">Total</p>
        <p className="text-xl font-bold text-brand">{formatPrice(total)}</p>
      </div>
      <form action="/api/checkout" method="POST">
        <button className="rounded-md bg-zinc-900 text-white px-4 py-2 font-medium hover:bg-zinc-800 disabled:opacity-50" disabled={items.length===0}>
          Procéder au paiement
        </button>
      </form>
      <p className="text-sm text-zinc-500">Le paiement utilise Stripe en mode test.</p>
    </div>
  )
}
