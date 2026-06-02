'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/** true seulement côté client (après hydratation) — évite les mismatches
 *  pour les états persistés (panier en localStorage). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client
    () => false, // serveur
  )
}
