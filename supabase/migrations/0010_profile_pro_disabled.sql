-- Permet à l'admin de désactiver temporairement un partenaire PRO sans perdre son statut.
-- Le rôle reste 'pro' (il apparaît dans la liste des partenaires) mais les tarifs PRO
-- ne s'appliquent que si pro_disabled = false.
alter table profiles
  add column if not exists pro_disabled boolean not null default false;
