import ProductForm from '@/components/product-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function SellPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold">Vendre un article</h1>
        <p className="mt-2 text-zinc-700">Vous devez être connecté pour publier.</p>
        <Link href="/auth/signin" className="text-brand underline">Se connecter</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vendre un article</h1>
      <ProductForm />
    </div>
  )
}
