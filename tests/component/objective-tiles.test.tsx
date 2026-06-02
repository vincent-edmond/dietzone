import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ObjectiveTiles } from '@/components/shop/home/ObjectiveTiles'

describe('ObjectiveTiles', () => {
  it('affiche les 4 objectifs avec les bons liens', () => {
    render(<ObjectiveTiles />)
    const masse = screen.getByRole('link', { name: /prise de masse/i })
    expect(masse).toHaveAttribute('href', '/boutique?objectif=prise-de-masse')
    expect(screen.getByText('Sèche')).toBeInTheDocument()
    expect(screen.getByText('Énergie')).toBeInTheDocument()
    expect(screen.getByText('Santé')).toBeInTheDocument()
  })
})
