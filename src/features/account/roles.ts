import type { Role } from '@/types/domain'

const RANK: Record<Role, number> = { customer: 0, pro: 1, admin: 2 }

/** Un rôle `userRole` peut-il accéder à une ressource exigeant `required` ? */
export function hasRoleAccess(userRole: Role, required: Role): boolean {
  return RANK[userRole] >= RANK[required]
}

/** Seuls les clients PRO bénéficient des tarifs remisés. */
export function isProPricing(role: Role): boolean {
  return role === 'pro'
}
