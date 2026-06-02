import { getCatalogContext } from '@/lib/assistant/context'
import { getSettings } from '@/features/admin/settings'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Retire le Markdown résiduel (le widget affiche du texte brut). */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // gras **x**
    .replace(/__(.*?)__/g, '$1') // gras __x__
    .replace(/(?<!\*)\*(?!\*)(.*?)\*/g, '$1') // italique *x*
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1') // code `x`
    .replace(/^#{1,6}\s*/gm, '') // titres #
    .replace(/^\s*[-*_]{3,}\s*$/gm, '') // séparateurs ---
    .replace(/^\s*>\s?/gm, '') // citations >
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // liens [txt](url)
    .replace(/\n{3,}/g, '\n\n') // espaces verticaux
    .trim()
}

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return Response.json({ reply: 'Requête invalide.' }, { status: 400 })
  }
  const messages = (body.messages ?? []).slice(-10)

  const settings = await getSettings()
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return Response.json({
      reply: `L'assistant en ligne n'est pas encore activé. Contactez-nous au ${settings.storePhone} ou passez en magasin (${settings.storeHours}).`,
    })
  }

  const catalog = await getCatalogContext()
  const system = `Tu es l'assistant virtuel de DietZone, magasin expert en nutrition sportive à St-Denis (La Réunion).
Tu connais le catalogue et les stocks ci-dessous. Aide le client à choisir selon son objectif (prise de masse, sèche, énergie, santé), indique la disponibilité et le prix (TTC en euros).

STYLE DE RÉPONSE (très important) :
- Réponses COURTES : 2 à 4 phrases maximum, va droit au but.
- Écris en TEXTE SIMPLE, comme un SMS. INTERDIT : le Markdown (pas de #, pas de **gras**, pas de tirets de titre ---, pas de tableaux, pas de listes à puces lourdes).
- Recommande 1 produit, 2 au maximum. Pour chacun, une seule ligne : Nom (marque) — prix € — dispo.
- Termine par une courte question ou une invitation à commander sur le site ou passer en magasin.
- Quelques emojis autorisés, avec parcimonie (1 ou 2 max).

Règles : chaleureux et expert ; si un produit est en rupture, propose une alternative en stock ; ne donne jamais de conseil médical ; magasin : ${settings.storeAddress}, ${settings.storeHours}.

CATALOGUE (nom [marque] · catégorie : variantes prix (stock)) :
${catalog}`

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 350,
        system,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    })
    if (!resp.ok) {
      return Response.json({
        reply: `Je rencontre un souci technique. Contactez-nous au ${settings.storePhone}.`,
      })
    }
    const data = (await resp.json()) as { content?: { text?: string }[] }
    const raw = data.content?.[0]?.text ?? 'Désolé, je n’ai pas de réponse pour le moment.'
    return Response.json({ reply: stripMarkdown(raw) })
  } catch {
    return Response.json({
      reply: `Je rencontre un souci technique. Contactez-nous au ${settings.storePhone}.`,
    })
  }
}
