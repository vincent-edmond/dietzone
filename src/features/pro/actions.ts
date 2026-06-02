'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/features/account/auth'

export interface ProFormState {
  error?: string
  message?: string
}

export async function submitProApplication(
  _prev: ProFormState,
  formData: FormData,
): Promise<ProFormState> {
  const user = await requireUser()
  const companyName = String(formData.get('company_name') ?? '').trim()
  const siret = String(formData.get('siret') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!companyName) return { error: 'Le nom de l’entreprise est requis.' }

  const sb = await createClient()
  const { error } = await sb.from('pro_applications').insert({
    user_id: user.id,
    company_name: companyName,
    siret: siret || null,
    phone: phone || null,
    message: message || null,
  })
  if (error) return { error: 'Impossible d’envoyer la demande. Réessayez.' }

  // TODO Plan 3 (emails) : notifier Alexandre via Resend.
  return {
    message:
      'Demande envoyée ! Alexandre la validera prochainement. Vous serez notifié par email.',
  }
}
