create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','pro','admin')),
  created_at timestamptz not null default now()
);

create table pro_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  siret text,
  phone text,
  message text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- Crée automatiquement un profile à l'inscription
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

alter table profiles enable row level security;
alter table pro_applications enable row level security;

create policy "user reads own profile" on profiles for select using (auth.uid() = id);
create policy "user updates own profile" on profiles for update using (auth.uid() = id);
create policy "user reads own applications" on pro_applications for select using (auth.uid() = user_id);
create policy "user creates own application" on pro_applications for insert with check (auth.uid() = user_id);
-- Policies admin ajoutées au Plan 5.
