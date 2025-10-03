import { prisma } from '@/lib/db'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import AddToCart from './parts/add-to-cart'

export default async function ProductDetail({ params }: any) {
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return notFound()

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border bg-zinc-100">
        {product.imageUrl && <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-zinc-700 mt-2">{product.description}</p>
        <p className="text-2xl font-bold text-brand mt-4">{formatPrice(product.priceCents)}</p>
        <div className="mt-6"><AddToCart productId={product.id} /></div>
      </div>
    </div>
  )
}
