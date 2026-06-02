import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/shop/ProductCard'

describe('ProductCard', () => {
  it('affiche le nom, la marque et le prix « à partir de »', () => {
    render(
      <ProductCard
        p={{
          id: 'p1',
          name: 'SuperPump Max',
          slug: 'superpump-max',
          brand: 'Gaspari',
          image: null,
          fromPriceCents: 4900,
          inStock: true,
        }}
      />,
    )
    expect(screen.getByText('SuperPump Max')).toBeInTheDocument()
    expect(screen.getByText('Gaspari')).toBeInTheDocument()
    expect(screen.getByText(/49,00 €/)).toBeInTheDocument()
  })

  it('affiche « En rupture » si hors stock', () => {
    render(
      <ProductCard
        p={{
          id: 'p2',
          name: 'X',
          slug: 'x',
          brand: null,
          image: null,
          fromPriceCents: 1000,
          inStock: false,
        }}
      />,
    )
    expect(screen.getByText(/rupture/i)).toBeInTheDocument()
  })

  it('lie vers la fiche produit', () => {
    render(
      <ProductCard
        p={{
          id: 'p1',
          name: 'SuperPump Max',
          slug: 'superpump-max',
          brand: 'Gaspari',
          image: null,
          fromPriceCents: 4900,
          inStock: true,
        }}
      />,
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/produit/superpump-max')
  })
})
