create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,  -- null si invité
  email text not null,
  status text not null default 'pending'
    check (status in ('pending','paid','to_pay_pickup','preparing','ready','shipped','picked_up','cancelled')),
  fulfillment text not null check (fulfillment in ('delivery','pickup')),
  payment_method text not null check (payment_method in ('card','pickup')),
  subtotal_cents int not null,
  shipping_cents int not null default 0,
  total_cents int not null,
  shipping_address jsonb,
  is_pro_order boolean not null default false,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  name_snapshot text not null,
  unit_price_cents int not null,
  qty int not null check (qty > 0)
);

create index on orders (user_id);
create index on orders (created_at desc);
create index on order_items (order_id);

-- Décrément de stock atomique (évite la survente)
create or replace function decrement_stock(p_variant_id uuid, p_qty int)
returns void language plpgsql as $$
begin
  update product_variants
    set stock_qty = stock_qty - p_qty
    where id = p_variant_id and stock_qty >= p_qty;
  if not found then
    raise exception 'STOCK_INSUFFISANT pour la variante %', p_variant_id;
  end if;
end; $$;
