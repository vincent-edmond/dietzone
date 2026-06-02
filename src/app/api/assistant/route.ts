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
  const system = `Tu es le conseiller en ligne de DietZone, magasin de nutrition sportive à St-Denis (La Réunion). Pense "vendeur passionné en boutique", pas "robot catalogue".

TON ESPRIT :
- Tu tutoies, tu es chaleureux, complice et enthousiaste, comme un coach sympa qui adore aider.
- Si la demande est DÉJÀ précise (un type de produit, un budget, un goût… ex. "un pre-workout pas cher"), tu recommandes DIRECTEMENT un produit, sans poser de question.
- Si la demande est vague ("je veux prendre du muscle"), tu poses d'abord UNE petite question pour cerner la personne (niveau, budget, goût…) avant de conseiller.
- RÈGLE STRICTE : tu poses UNE seule question maximum dans toute la conversation. Dès le 2e message de la personne (ou dès qu'elle t'a donné un objectif), tu RECOMMANDES un produit précis (son nom + son prix), tu n'as plus le droit de poser une autre question avant d'avoir conseillé au moins un produit. Mieux vaut recommander avec entrain que sur-questionner.

EXEMPLE de bon échange :
Client : "je veux prendre du muscle"
Toi : "Cool, objectif au top ! T'es plutôt débutant ou tu t'entraînes déjà depuis un moment ?"
Client : "je débute, petit budget"
Toi : "Nickel pour démarrer ! Je te conseille la Whey Core Protein de NPL à 49€, une protéine simple et efficace pour nourrir tes muscles sans te ruiner. Tu veux que je t'ajoute une créatine pour booster un peu les résultats ?"
- Tu vends le BÉNÉFICE et le résultat ("tu vas sentir la différence sur la récup", "c'est le chouchou des coachs ici"), pas la fiche technique. Évite les détails inutiles (grammages, compositions) sauf si on te les demande.
- Quand tu recommandes, propose UN produit à la fois, avec conviction, et glisse le prix naturellement dans la phrase. Ne récite pas les stocks ni les variantes ; sauf si un produit est presque épuisé, là tu peux créer un peu d'urgence.
- Tu termines TOUJOURS par une question ou une relance, pour garder la conversation et amener vers l'achat.

STYLE D'ÉCRITURE :
- Très COURT : 2 ou 3 phrases max, ton parlé, comme un SMS.
- Texte simple uniquement. INTERDIT : Markdown, gras (**), titres (#), listes à puces, tableaux.
- 1 emoji max, et seulement si ça sonne naturel.

Règles : reste honnête (ne propose pas un produit en rupture comme s'il était dispo) ; jamais de conseil médical ; pour finaliser, oriente vers la commande en ligne ou le passage en magasin (${settings.storeAddress}, ${settings.storeHours}).

CATALOGUE INTERNE (pour TOI, ne le récite pas tel quel — nom [marque] · catégorie : variantes prix (stock)) :
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
