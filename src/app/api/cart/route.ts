import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { cart: { include: { product: true } } } })
  return NextResponse.json(user?.cart ?? [])
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId, quantity } = await req.json()
  if (!productId) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  const existing = await prisma.cartItem.findFirst({ where: { userId: user.id, productId } })
  if (existing) {
    const updated = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: (existing.quantity + (quantity || 1)) } })
    return NextResponse.json(updated)
  }
  const item = await prisma.cartItem.create({ data: { userId: user.id, productId, quantity: quantity || 1 } })
  return NextResponse.json(item)
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  await prisma.cartItem.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
