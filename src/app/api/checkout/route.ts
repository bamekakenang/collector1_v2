import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.redirect(new URL('/auth/signin', process.env.NEXTAUTH_URL))

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { cart: { include: { product: true } } } })
  if (!user || !user.cart.length) return NextResponse.redirect(new URL('/cart', process.env.NEXTAUTH_URL))

  const line_items = user.cart.map(ci => ({
    price_data: {
      currency: 'eur',
      product_data: { name: ci.product.title, description: ci.product.description },
      unit_amount: ci.product.priceCents,
    },
    quantity: ci.quantity,
  }))

  const totalCents = user.cart.reduce((acc, ci) => acc + ci.quantity * ci.product.priceCents, 0)
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalCents,
      status: 'PENDING',
      items: {
        create: user.cart.map(ci => ({
          productId: ci.productId,
          quantity: ci.quantity,
          priceCents: ci.product.priceCents
        }))
      }
    }
  })

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: `${process.env.NEXTAUTH_URL}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
    metadata: { orderId: order.id }
  })

  return NextResponse.redirect(checkout.url!, { status: 303 })
}
