-- Quantité minimale de commande (MOQ) par produit pour les comptes PRO. Réglable par l'admin.
alter table settings
  add column if not exists pro_min_qty_per_item int not null default 10
  check (pro_min_qty_per_item between 1 and 1000);
