-- Taux de TVA par produit (en %). Défaut 8,5 % : taux normal à La Réunion.
-- Les prix des variantes restent stockés TTC ; HT et TVA sont dérivés à l'affichage.
alter table products
  add column if not exists vat_rate numeric(5, 2) not null default 8.5;
