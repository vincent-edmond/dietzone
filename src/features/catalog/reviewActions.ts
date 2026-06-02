'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/features/account/auth'

export interface ReviewState {
  error?: string
  message?: string
}

export async function submitReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const user = await requireUser()
  const productId = String(formData.get('product_id') ?? '')
  const slug = String(formData.get('slug') ?? '')
  const rating = Number(formData.get('rating') ?? 0)
  const comment = String(formData.get('comment') ?? '').trim()
  if (!productId || rating < 1 || rating > 5) return { error: 'Choisissez une note de 1 à 5.' }

  const sb = await createClient()
  const authorName = user.fullName || user.email.split('@')[0]
  const { error } = await sb.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    author_name: authorName,
    rating,
    comment: comment || null,
  })
  if (error) return { error: 'Impossible d’envoyer l’avis. Réessayez.' }

  revalidatePath(`/produit/${slug}`)
  return { message: 'Merci pour votre avis !' }
}
