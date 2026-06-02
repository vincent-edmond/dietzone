import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home', () => {
  it('affiche le nom de la marque', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: 'DietZone' })).toBeInTheDocument()
  })
})
