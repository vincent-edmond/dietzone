/** Récupère une variable d'environnement requise, ou jette une erreur explicite. */
export function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Variable d'environnement manquante : ${name}`)
  return v
}
