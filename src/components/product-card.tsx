import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({ product }: any) {
  return (
    <Link href={`/product/${product.id}`} className="group rounded-2xl overflow-hidden border bg-white hover:shadow-lg transition-all">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-zinc-100 to-zinc-200">
        {product.imageUrl && (
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1">{product.title}</h3>
        <p className="text-sm text-zinc-600 line-clamp-2">{product.description}</p>
        <p className="mt-2 font-bold text-brand">{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  )
}
