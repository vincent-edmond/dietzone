-- Sécurité : fige le search_path de la fonction (linter Supabase).
create or replace function decrement_stock(p_variant_id uuid, p_qty int)
returns void language plpgsql
set search_path = ''
as $$
begin
  update public.product_variants
    set stock_qty = stock_qty - p_qty
    where id = p_variant_id and stock_qty >= p_qty;
  if not found then
    raise exception 'STOCK_INSUFFISANT pour la variante %', p_variant_id;
  end if;
end; $$;
