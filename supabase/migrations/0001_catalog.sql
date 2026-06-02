-- Catégories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Marques
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);

-- Objectifs (Prise de masse, Sèche, Énergie, Santé)
create table objectives (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

-- Produits
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Variantes (saveur/taille). Prix en CENTIMES.
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  sku text unique,
  price_cents int not null check (price_cents >= 0),
  stock_qty int not null default 0 check (stock_qty >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Jonction produit <-> objectif
create table product_objectives (
  product_id uuid not null references products(id) on delete cascade,
  objective_id uuid not null references objectives(id) on delete cascade,
  primary key (product_id, objective_id)
);

create index on products (category_id);
create index on products (brand_id);
create index on product_variants (product_id);
