create table settings (
  id boolean primary key default true check (id),  -- singleton (une seule ligne)
  pro_discount_percent int not null default 20 check (pro_discount_percent between 0 and 90),
  free_shipping_threshold_cents int not null default 4499,
  shipping_fee_cents int not null default 500,
  store_name text not null default 'DietZone',
  store_address text not null default '6b rue Léopauld Rambaud, St-Denis, La Réunion',
  store_phone text not null default '0692 78 35 08',
  store_hours text not null default '11H - 18H, Lundi au Vendredi',
  whatsapp_number text not null default ''
);
insert into settings (id) values (true) on conflict do nothing;

alter table settings enable row level security;
create policy "public read settings" on settings for select using (true);
-- Écriture : admin uniquement (policy ajoutée au Plan 5).
