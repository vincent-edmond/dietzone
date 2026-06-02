import { createClient } from '@/lib/supabase/server'

export interface Rating {
  avg: number
  count: number
}

export interface ReviewRow {
  id: string
  authorName: string
  rating: number
  comment: string | null
  createdAt: string
}

export async function getRating(productId: string): Promise<Rating> {
  const sb = await createClient()
  const { data } = await sb
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('status', 'approved')
  const ratings = (data ?? []).map((r) => r.rating as number)
  const count = ratings.length
  const avg = count ? Math.round((ratings.reduce((a, b) => a + b, 0) / count) * 10) / 10 : 0
  return { avg, count }
}

export async function listReviews(productId: string): Promise<ReviewRow[]> {
  const sb = await createClient()
  const { data } = await sb
    .from('reviews')
    .select('id, author_name, rating, comment, created_at')
    .eq('product_id', productId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(20)
  return (data ?? []).map((r) => ({
    id: r.id,
    authorName: r.author_name ?? 'Client',
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
  }))
}
