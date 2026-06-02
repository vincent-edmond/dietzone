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

export async function rejectApplication(id: string): Promise<void> {
  await requireRole('admin')
  const sb = await createClient()
  await sb
    .from('pro_applications')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/admin/demandes-pro')
}
