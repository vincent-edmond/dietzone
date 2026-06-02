const fmt = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formate des centimes en chaîne euros FR, ex. 6500 -> "65,00 €". */
export function formatEuros(cents: number): string {
  return `${fmt.format(cents / 100)} €`
}

/** Convertit des euros (saisie) en centimes entiers, ex. 65.9 -> 6590. */
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100)
}

/** Applique une remise en pourcentage à un montant en centimes, arrondi au centime. */
export function applyProDiscount(cents: number, percent: number): number {
  return Math.round((cents * (100 - percent)) / 100)
}
