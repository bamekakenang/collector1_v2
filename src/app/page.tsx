import { prisma } from '@/lib/db'
import ProductCard from '@/components/product-card'

export default async function Home() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-cyan-50 to-sky-100 p-8 border">
        <h1 className="text-3xl font-bold tracking-tight">Bienvenue sur <span className="text-brand">Collector.shop</span></h1>
        <p className="text-zinc-700 mt-2">Trouvez, vendez et achetez des objets de collection en toute simplicité.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </section>
    </div>
  )
}
