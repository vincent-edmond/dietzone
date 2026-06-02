'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from './auth'

export interface AuthState {
  error?: string
  message?: string
}

export async function updateProfile(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const user = await requireUser()
  const fullName = String(formData.get('full_name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const sb = await createClient()
  const { error } = await sb
    .from('profiles')
    .update({ full_name: fullName || null, phone: phone || null })
    .eq('id', user.id)
  if (error) return { error: 'Impossible de mettre à jour le profil.' }
  revalidatePath('/compte')
  return { message: 'Profil mis à jour.' }
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const sb = await createClient()
  const { error } = await sb.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Email ou mot de passe incorrect.' }
  redirect('/compte')
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('full_name') ?? '')
  if (password.length < 6) {
    return { error: 'Le mot de passe doit faire au moins 6 caractères.' }
  }
  const sb = await createClient()
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) return { error: error.message }
  if (data.session) redirect('/compte')
  return { message: 'Compte créé ! Vérifiez votre email pour confirmer votre inscription.' }
}

export async function signOut(): Promise<void> {
  const sb = await createClient()
  await sb.auth.signOut()
  redirect('/')
}
