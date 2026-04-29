-- =============================================================
--  locpilote — schéma Supabase
-- =============================================================
--  À coller dans Supabase → SQL Editor → Run.
--  Idempotent : peut être rejoué plusieurs fois sans casser.
-- =============================================================

-- -----------------------------------------------------------------
--  Table: properties
-- -----------------------------------------------------------------
create table if not exists public.properties (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  inputs       jsonb not null default '{
    "airbnbRevenue": 0,
    "bookingRevenue": 0,
    "futureRevenue": 0,
    "credit": 0,
    "elec": 0,
    "eau": 0,
    "internet": 0,
    "menage": 0,
    "airbnbFeePct": 3,
    "bookingFeePct": 15
  }'::jsonb,
  airbnb_url      text not null default '',
  booking_url     text not null default '',
  airbnb_bookings jsonb not null default '[]'::jsonb,
  booking_bookings jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists properties_user_id_idx on public.properties(user_id);

-- -----------------------------------------------------------------
--  Table: subscriptions
--  Source de vérité pour le plan actif. Alimentée par le webhook
--  Lemon Squeezy — jamais par le client.
-- -----------------------------------------------------------------
create table if not exists public.subscriptions (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  plan                 text check (plan in ('starter','pro','unlimited')),
  status               text not null default 'inactive'
                       check (status in ('active','inactive','past_due','canceled')),
  ls_customer_id       text,
  ls_subscription_id   text,
  ls_variant_id        text,
  current_period_end   timestamptz,
  updated_at           timestamptz not null default now()
);

-- Migration : supprime les anciennes colonnes Stripe si elles existent encore
do $$ begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='subscriptions' and column_name='stripe_customer_id') then
    alter table public.subscriptions drop column stripe_customer_id;
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='subscriptions' and column_name='stripe_subscription_id') then
    alter table public.subscriptions drop column stripe_subscription_id;
  end if;
end $$;

-- -----------------------------------------------------------------
--  Trigger: updated_at auto
-- -----------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_touch on public.properties;
create trigger properties_touch
  before update on public.properties
  for each row execute function public.touch_updated_at();

drop trigger if exists subscriptions_touch on public.subscriptions;
create trigger subscriptions_touch
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------
--  RLS — chaque user n'accède qu'à ses propres lignes
-- -----------------------------------------------------------------
alter table public.properties     enable row level security;
alter table public.subscriptions  enable row level security;

-- properties
drop policy if exists "properties_select_own" on public.properties;
create policy "properties_select_own" on public.properties
  for select using (auth.uid() = user_id);

drop policy if exists "properties_insert_own" on public.properties;
create policy "properties_insert_own" on public.properties
  for insert with check (auth.uid() = user_id);

drop policy if exists "properties_update_own" on public.properties;
create policy "properties_update_own" on public.properties
  for update using (auth.uid() = user_id);

drop policy if exists "properties_delete_own" on public.properties;
create policy "properties_delete_own" on public.properties
  for delete using (auth.uid() = user_id);

-- subscriptions : lecture seule côté client, écriture réservée au
-- service role (utilisé par le webhook Stripe).
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);
