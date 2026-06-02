-- Informations professionnelles complémentaires pour la validation d'une demande PRO.
alter table pro_applications
  add column if not exists contact_name text,
  add column if not exists activity_type text,
  add column if not exists website text;
