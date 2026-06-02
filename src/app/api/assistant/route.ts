import { getCatalogContext } from '@/lib/assistant/context'
import { getSettings } from '@/features/admin/settings'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
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
Règles : sois concis, chaleureux et expert ; si un produit est en rupture, propose une alternative en stock ; ne donne jamais de conseil médical ; pour finaliser, invite à commander sur le site ou à passer en magasin (${settings.storeAddress}, ${settings.storeHours}).

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
        model: 'claude-3-5-haiku-latest',
        max_tokens: 700,
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
    const reply = data.content?.[0]?.text ?? 'Désolé, je n’ai pas de réponse pour le moment.'
    return Response.json({ reply })
  } catch {
    return Response.json({
      reply: `Je rencontre un souci technique. Contactez-nous au ${settings.storePhone}.`,
    })
  }
}
