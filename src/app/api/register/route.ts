import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, name, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: 'Email exists' }, { status: 400 })
  const hash = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { email, name, password: hash } })
  return NextResponse.json({ ok: true })
}
