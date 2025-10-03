import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { title, description, priceCents, imageUrl } = await req.json()
  if (!title || !description || !priceCents) return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  const product = await prisma.product.create({
    data: { title, description, priceCents: Number(priceCents), imageUrl: imageUrl || null, sellerId: user.id }
  })
  return NextResponse.json(product)
}
