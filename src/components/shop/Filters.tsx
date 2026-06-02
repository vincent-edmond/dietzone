'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TaxonomyItem } from '@/features/catalog/taxonomy'

const ALL = 'all'

interface FiltersProps {
  categories: TaxonomyItem[]
  brands: TaxonomyItem[]
  objectives: TaxonomyItem[]
}

export function Filters({ categories, brands, objectives }: FiltersProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [search, setSearch] = useState(params.get('q') ?? '')

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString())
    if (!value || value === ALL) next.delete(key)
    else next.set(key, value)
    router.push(`/boutique?${next.toString()}`)
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setParam('q', search.trim())
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <form onSubmit={onSearchSubmit} className="flex-1 sm:max-w-xs">
        <Input
          type="search"
          placeholder="Rechercher un produit…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Rechercher"
        />
      </form>

      <Select
        value={params.get('categorie') ?? ALL}
        onValueChange={(v) => setParam('categorie', v)}
      >
        <SelectTrigger className="w-full sm:w-44" aria-label="Catégorie">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Toutes catégories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.slug} value={c.slug}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={params.get('marque') ?? ALL} onValueChange={(v) => setParam('marque', v)}>
        <SelectTrigger className="w-full sm:w-44" aria-label="Marque">
          <SelectValue placeholder="Marque" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Toutes marques</SelectItem>
          {brands.map((b) => (
            <SelectItem key={b.slug} value={b.slug}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get('objectif') ?? ALL}
        onValueChange={(v) => setParam('objectif', v)}
      >
        <SelectTrigger className="w-full sm:w-44" aria-label="Objectif">
          <SelectValue placeholder="Objectif" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tous objectifs</SelectItem>
          {objectives.map((o) => (
            <SelectItem key={o.slug} value={o.slug}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={params.get('tri') ?? 'newest'} onValueChange={(v) => setParam('tri', v)}>
        <SelectTrigger className="w-full sm:w-44" aria-label="Trier">
          <SelectValue placeholder="Trier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Nouveautés</SelectItem>
          <SelectItem value="price_asc">Prix croissant</SelectItem>
          <SelectItem value="price_desc">Prix décroissant</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
