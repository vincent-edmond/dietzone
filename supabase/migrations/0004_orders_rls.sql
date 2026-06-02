alter table orders enable row level security;
alter table order_items enable row level security;

-- Le client connecté voit ses commandes ; les commandes invité ne sont pas lisibles via l'API publique.
create policy "user reads own orders" on orders for select using (auth.uid() = user_id);
create policy "user reads own order items" on order_items for select
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));
-- Écriture commandes : SERVICE ROLE uniquement (Server Actions / webhook). Pas de policy insert publique.
