-- Helper : l'utilisateur courant est-il admin ? (security definer pour éviter la récursion sur profiles)
create function is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Catalogue : écriture admin
create policy "admin writes products" on products for all using (is_admin()) with check (is_admin());
create policy "admin writes variants" on product_variants for all using (is_admin()) with check (is_admin());
create policy "admin writes categories" on categories for all using (is_admin()) with check (is_admin());
create policy "admin writes brands" on brands for all using (is_admin()) with check (is_admin());
create policy "admin writes objectives" on objectives for all using (is_admin()) with check (is_admin());
create policy "admin writes product_objectives" on product_objectives for all using (is_admin()) with check (is_admin());

-- Commandes
create policy "admin reads all orders" on orders for select using (is_admin());
create policy "admin updates orders" on orders for update using (is_admin());
create policy "admin reads all order_items" on order_items for select using (is_admin());

-- PRO / profiles
create policy "admin reads applications" on pro_applications for select using (is_admin());
create policy "admin updates applications" on pro_applications for update using (is_admin());
create policy "admin reads profiles" on profiles for select using (is_admin());
create policy "admin updates profiles" on profiles for update using (is_admin());

-- Settings
create policy "admin updates settings" on settings for update using (is_admin()) with check (is_admin());

-- Storage : bucket images produits
insert into storage.buckets (id, name, public) values ('product-images','product-images', true) on conflict do nothing;
-- Bucket public : accès aux fichiers via URL directe (pas de policy SELECT large = pas de listing).
create policy "admin manages product images" on storage.objects for all
  using (bucket_id = 'product-images' and is_admin()) with check (bucket_id = 'product-images' and is_admin());
