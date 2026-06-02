// Types de domaine partagés — source de vérité (cf docs/superpowers/plans/00-conventions.md)

export type Role = 'customer' | 'pro' | 'admin'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'to_pay_pickup'
  | 'preparing'
  | 'ready'
  | 'shipped'
  | 'picked_up'
  | 'cancelled'

export type Fulfillment = 'delivery' | 'pickup'
export type PaymentMethod = 'card' | 'pickup'
export type ProStatus = 'pending' | 'approved' | 'rejected'

/** Toujours exprimé en centimes (entier). */
export interface Money {
  cents: number
}

export interface CartLine {
  variantId: string
  productId: string
  /** Snapshot lisible, ex. "Ripped Whey — Chocolat 2KG". */
  name: string
  /** Prix PUBLIC unitaire en centimes ; la remise pro est appliquée au calcul du total. */
  unitPriceCents: number
  qty: number
  image?: string
  maxStock: number
}
