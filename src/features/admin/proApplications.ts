'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/features/account/auth'

export interface ProApplicationRow {
  id: string
  userId: string
  email: string
  companyName: string
  contactName: string | null
  activityType: string | null
  siret: string | null
  phone: string | null
  website: string | null
  message: string | null
  createdAt: string
}

export async function listPendingApplications(): Promise<ProApplicationRow[]> {
  await requireRole('admin')
  const sb = await createClient()
  const { data: apps } = await sb
    .from('pro_applications')
    .select(
      'id, user_id, company_name, contact_name, activity_type, siret, phone, website, message, created_at',
    )
    .eq('status', 'pending')
    .order('created_at')
  const rows = apps ?? []
  const userIds = rows.map((a) => a.user_id)
  const { data: profs } = userIds.length
    ? await sb.from('profiles').select('id, email').in('id', userIds)
    : { data: [] as { id: string; email: string }[] }
  const emailById = Object.fromEntries((profs ?? []).map((p) => [p.id, p.email]))
  return rows.map((a) => ({
    id: a.id,
    userId: a.user_id,
    email: emailById[a.user_id] ?? '',
    companyName: a.company_name,
    contactName: a.contact_name,
    activityType: a.activity_type,
    siret: a.siret,
    phone: a.phone,
    website: a.website,
    message: a.message,
    createdAt: a.created_at,
  }))
}

export async function approveApplication(id: string): Promise<void> {
  await requireRole('admin')
  const sb = await createClient()
  const { data: app } = await sb
    .from('pro_applications')
    .select('user_id')
    .eq('id', id)
    .maybeSingle()
  if (!app) return
  await sb
    .from('pro_applications')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', id)
  await sb.from('profiles').update({ role: 'pro' }).eq('id', app.user_id)
  // TODO Plan 3 (emails) : notifier le partenaire de l'approbation (Resend).
  revalidatePath('/admin/demandes-pro')
}

export interface ProPartnerRow {
  userId: string
  email: string
  fullName: string | null
  phone: string | null
  company: string | null
  active: boolean
}

/** Liste tous les partenaires PRO (rôle pro), actifs ou désactivés. */
export async function listProPartners(): Promise<ProPartnerRow[]> {
  await requireRole('admin')
  const sb = await createClient()
  const { data: profs } = await sb
    .from('profiles')
    .select('id, email, full_name, phone, pro_disabled')
    .eq('role', 'pro')
    .order('email')
  const rows = profs ?? []
  const ids = rows.map((p) => p.id)
  const { data: apps } = ids.length
    ? await sb
        .from('pro_applications')
        .select('user_id, company_name, phone, created_at')
        .in('user_id', ids)
        .order('created_at', { ascending: false })
    : { data: [] as { user_id: string; company_name: string; phone: string | null }[] }
  const companyByUser: Record<string, string> = {}
  const phoneByUser: Record<string, string> = {}
  for (const a of apps ?? []) {
    if (!(a.user_id in companyByUser)) companyByUser[a.user_id] = a.company_name
    if (a.phone && !(a.user_id in phoneByUser)) phoneByUser[a.user_id] = a.phone
  }
  return rows.map((p) => ({
    userId: p.id,
    email: p.email,
    fullName: p.full_name,
    phone: p.phone ?? phoneByUser[p.id] ?? null,
    company: companyByUser[p.id] ?? null,
    active: !p.pro_disabled,
  }))
}

/** Active / désactive les tarifs PRO d'un partenaire (le rôle reste 'pro'). */
export async function setProActive(userId: string, active: boolean): Promise<void> {
  await requireRole('admin')
  const sb = await createClient()
  await sb.from('profiles').update({ pro_disabled: !active }).eq('id', userId)
  revalidatePath('/admin/demandes-pro')
}

export async function rejectApplication(id: string): Promise<void> {
  await requireRole('admin')
  const sb = await createClient()
  await sb
    .from('pro_applications')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/admin/demandes-pro')
}
