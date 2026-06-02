// Images de DÉMONSTRATION (Unsplash, libres) pour habiller le site.
// À remplacer par les vraies photos de DietZone plus tard — il suffit d'éditer ce fichier.

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const demoImages = {
  hero: U('1581009146145-b5ef050c2e1e', 1920), // athlète, salle sombre
  cta: U('1599058917212-d750089bc07e', 1600), // battle ropes
  objectives: {
    'prise-de-masse': U('1581009146145-b5ef050c2e1e', 700),
    seche: U('1571019613454-1cb2f99b2d8b', 700), // training
    energie: U('1599058917212-d750089bc07e', 700), // battle ropes
    sante: U('1534438327276-14e5300c3a48', 700), // salle / haltères
  } as Record<string, string>,
}
