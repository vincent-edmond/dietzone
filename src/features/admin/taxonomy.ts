import { createClient } from '@/lib/supabase/server'

export interface IdName {
  id: string
  name: string
}

export async function adminBrands(): Promise<IdName[]> {
  const sb = await createClient()
  const { data } = await sb.from('brands').select('id, name').order('name')
  return data ?? []
}

export async function adminCategories(): Promise<IdName[]> {
  const sb = await createClient()
  const { data } = await sb.from('categories').select('id, name').order('position')
  return data ?? []
}

export async function adminObjectives(): Promise<IdName[]> {
  const sb = await createClient()
  const { data } = await sb.from('objectives').select('id, name').order('name')
  return data ?? []
}
