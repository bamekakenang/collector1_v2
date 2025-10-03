'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const NavLink = ({ href, children }: any) => {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link href={href} className={`px-3 py-2 rounded-md text-sm font-medium ${active ? 'bg-brand text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}>
      {children}
    </Link>
  )
}

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">Collector<span className="text-brand">.shop</span></Link>
        <div className="flex items-center gap-2">
          <NavLink href="/">Accueil</NavLink>
          <NavLink href="/sell">Vendre</NavLink>
          <NavLink href="/cart">Panier</NavLink>
          {!session && <NavLink href="/auth/signin">Se connecter</NavLink>}
          {!session && <NavLink href="/auth/signup">Créer un compte</NavLink>}
          {session && (
            <button onClick={() => signOut()} className="px-3 py-2 rounded-md text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800">
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
