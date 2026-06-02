import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasRoleAccess } from './roles'
import type { Role } from '@/types/domain'

export interface CurrentUser {
  id: string
  email: string
  role: Role
  fullName: string | null
  phone: string | null
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const sb = await createClient()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return null

  const { data: profile } = await sb
    .from('profiles')
    .select('role, full_name, phone, email')
    .eq('id', user.id)
    .maybeSingle()

  return {
    id: user.id,
    email: user.email ?? profile?.email ?? '',
    role: (profile?.role ?? 'customer') as Role,
    fullName: profile?.full_name ?? null,
    phone: profile?.phone ?? null,
  }
}

/** Exige un utilisateur connecté, sinon redirige vers /connexion. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/connexion')
  return user
}

/** Exige un rôle minimum, sinon redirige. */
export async function requireRole(role: Role): Promise<CurrentUser> {
  const user = await requireUser()
  if (!hasRoleAccess(user.role, role)) redirect('/')
  return user
}
