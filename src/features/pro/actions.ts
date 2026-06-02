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
  const contactName = String(formData.get('contact_name') ?? '').trim()
  const activityType = String(formData.get('activity_type') ?? '').trim()
  const siret = String(formData.get('siret') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const website = String(formData.get('website') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!companyName) return { error: 'Le nom de l’entreprise est requis.' }
  if (!contactName) return { error: 'Le nom du contact est requis.' }
  if (!activityType) return { error: 'Précisez votre type d’activité.' }
  if (siret.replace(/\s/g, '').length < 9) {
    return { error: 'Un numéro SIRET / SIREN valide est requis pour un compte PRO.' }
  }
  // Téléphone mobile de contact obligatoire (au moins 10 chiffres).
  if (phone.replace(/\D/g, '').length < 10) {
    return { error: 'Un numéro de téléphone mobile valide est requis.' }
  }

  const sb = await createClient()
  const { error } = await sb.from('pro_applications').insert({
    user_id: user.id,
    company_name: companyName,
    contact_name: contactName,
    activity_type: activityType,
    siret,
    phone,
    website: website || null,
    message: message || null,
  })
  if (error) return { error: 'Impossible d’envoyer la demande. Réessayez.' }

  // TODO Plan 3 (emails) : notifier Alexandre via Resend.
  return {
    message:
      'Demande envoyée ! Alexandre la validera prochainement. Vous serez notifié par email.',
  }
}
