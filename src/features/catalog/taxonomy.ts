import { createClient } from '@/lib/supabase/server'

export interface TaxonomyItem {
  name: string
  slug: string
}

export async function listCategories(): Promise<TaxonomyItem[]> {
  const sb = await createClient()
  const { data } = await sb.from('categories').select('name, slug').order('position')
  return data ?? []
}

export async function listBrands(): Promise<TaxonomyItem[]> {
  const sb = await createClient()
  const { data } = await sb.from('brands').select('name, slug').order('name')
  return data ?? []
}

export async function listObjectives(): Promise<TaxonomyItem[]> {
  const sb = await createClient()
  const { data } = await sb.from('objectives').select('name, slug').order('name')
  return data ?? []
}
