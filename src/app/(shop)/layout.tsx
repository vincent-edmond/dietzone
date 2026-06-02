import Link from 'next/link'
import { CartButton } from '@/components/shop/CartButton'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            DIET<span className="text-red-600">ZONE</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/boutique"
              className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
            >
              Boutique
            </Link>
            <CartButton />
          </nav>
        </div>
      </header>
      {children}
    </>
  )
}
