import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: ctx.params.id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}
