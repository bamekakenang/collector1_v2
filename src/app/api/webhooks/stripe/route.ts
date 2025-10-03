import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !whSecret) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  const payload = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(payload, sig, whSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const cs = event.data.object as any
    const orderId = cs.metadata?.orderId
    if (orderId) {
      await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID', stripeId: cs.id } })
      const order = await prisma.order.findUnique({ where: { id: orderId } })
      if (order) {
        await prisma.cartItem.deleteMany({ where: { userId: order.userId } })
      }
    }
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: { bodyParser: false }
}
