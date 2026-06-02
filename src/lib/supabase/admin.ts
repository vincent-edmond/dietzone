import { createClient as createSb } from '@supabase/supabase-js'
import { requireEnv } from './env'

/**
 * Client Supabase avec la clé service role.
 * SERVEUR UNIQUEMENT — ne jamais importer dans un composant client.
 * Contourne la RLS : à utiliser seulement après vérification du rôle côté serveur.
 */
export function createAdminClient() {
  return createSb(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false } },
  )
}
