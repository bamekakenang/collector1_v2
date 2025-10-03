import './globals.css'
import { ReactNode } from 'react'
import Navbar from '@/components/navbar'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/session-provider'
import { authOptions } from '@/lib/auth'

export const metadata = {
  title: 'Collector.shop — Démo locale',
  description: 'Achat/vente d’objets de collection — Démo locale'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="fr">
      <body>
        <SessionProvider session={session as any}>
          <Navbar />
          <main className="container py-8">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
