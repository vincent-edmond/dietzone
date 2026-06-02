alter table categories enable row level security;
alter table brands enable row level security;
alter table objectives enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_objectives enable row level security;

-- Lecture publique
create policy "public read categories" on categories for select using (true);
create policy "public read brands" on brands for select using (true);
create policy "public read objectives" on objectives for select using (true);
create policy "public read active products" on products for select using (is_active = true);
create policy "public read active variants" on product_variants for select using (is_active = true);
create policy "public read product_objectives" on product_objectives for select using (true);
-- Écriture : aucune policy publique (réservée au service role / admin, géré Plan 5).
