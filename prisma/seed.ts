import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const seller = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: { email: 'seller@example.com', name: 'Demo Seller', password, role: 'USER' }
  })

  await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: { email: 'buyer@example.com', name: 'Demo Buyer', password, role: 'USER' }
  })

  await prisma.product.createMany({
    data: [
      { title: 'Console rétro', description: 'Super console vintage', priceCents: 19900, imageUrl: 'https://picsum.photos/seed/console/800/600', sellerId: seller.id },
      { title: 'Carte rare', description: 'Édition limitée', priceCents: 9900, imageUrl: 'https://picsum.photos/seed/carte/800/600', sellerId: seller.id },
      { title: 'Figurine 90s', description: 'Collector original', priceCents: 14900, imageUrl: 'https://picsum.photos/seed/figurine/800/600', sellerId: seller.id },
    ]
  })

  console.log('Seed done: seller@example.com / buyer@example.com (password123)')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
