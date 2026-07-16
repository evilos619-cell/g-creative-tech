-- Sync fixes: ensure required columns, tables and constraints exist
-- Idempotent statements to reconcile DB with frontend expectations

create extension if not exists pgcrypto;

-- Ensure portfolio_categories.slug exists, populated, unique and not null
create table if not exists public.portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_categories add column if not exists slug text;

with ranked as (
  select
    id,
    lower(regexp_replace(coalesce(slug, name), '[^a-z0-9]+', '-', 'g')) as base_slug,
    row_number() over (
      partition by lower(regexp_replace(coalesce(slug, name), '[^a-z0-9]+', '-', 'g'))
      order by id
    ) as rn
  from public.portfolio_categories
)
update public.portfolio_categories pc
set slug = case
  when ranked.rn = 1 then ranked.base_slug
  else ranked.base_slug || '-' || ranked.rn::text
end
from ranked
where pc.id = ranked.id and (pc.slug is null or trim(pc.slug) = '');

alter table public.portfolio_categories alter column slug set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'portfolio_categories_slug_key') then
    alter table public.portfolio_categories add constraint portfolio_categories_slug_key unique (slug);
  end if;
end $$;

create unique index if not exists portfolio_categories_slug_unique on public.portfolio_categories (slug);

-- Ensure portfolio_items table and columns exist
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  category_id uuid,
  description text,
  image_url text,
  project_url text,
  client_name text,
  completed_at date,
  tags text[],
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_items add column if not exists category_id uuid;
alter table public.portfolio_items add column if not exists slug text;
alter table public.portfolio_items add column if not exists description text;
alter table public.portfolio_items add column if not exists image_url text;
alter table public.portfolio_items add column if not exists project_url text;
alter table public.portfolio_items add column if not exists client_name text;
alter table public.portfolio_items add column if not exists completed_at date;
alter table public.portfolio_items add column if not exists tags text[];
alter table public.portfolio_items add column if not exists published boolean not null default true;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'portfolio_items_category_id_fkey'
  ) then
    alter table public.portfolio_items
      add constraint portfolio_items_category_id_fkey
      foreign key (category_id) references public.portfolio_categories(id) on delete set null;
  end if;
end $$;

create index if not exists portfolio_items_category_id_idx on public.portfolio_items (category_id);
create index if not exists portfolio_items_published_idx on public.portfolio_items (published, created_at desc);

-- Ensure testimonials.enabled exists and is boolean not null default true
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  role text,
  quote text not null,
  rating int not null default 5,
  logo_url text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials add column if not exists enabled boolean not null default true;
update public.testimonials set enabled = true where enabled is null;
alter table public.testimonials alter column enabled set default true;
alter table public.testimonials alter column enabled set not null;

-- Ensure team_members has description and bio (bio nullable)
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  description text,
  bio text,
  photo_url text,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.team_members add column if not exists description text;
alter table public.team_members add column if not exists bio text;
-- if bio exists but is not nullable, make it nullable (preserve data)
do $$
begin
  if exists (select 1 from information_schema.columns where table_name='team_members' and column_name='bio') then
    begin
      execute 'alter table public.team_members alter column bio drop not null';
    exception when others then null;
    end;
  end if;
end $$;

-- Ensure recent_projects.description is nullable
create table if not exists public.recent_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.recent_projects add column if not exists description text;
alter table public.recent_projects alter column description drop not null;

-- Ensure storage bucket 'media' exists and is public
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Triggers to maintain updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach triggers for tables where missing
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'portfolio_items_set_updated_at') then
    create trigger portfolio_items_set_updated_at
    before update on public.portfolio_items
    for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'portfolio_categories_set_updated_at') then
    create trigger portfolio_categories_set_updated_at
    before update on public.portfolio_categories
    for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'team_members_set_updated_at') then
    create trigger team_members_set_updated_at
    before update on public.team_members
    for each row execute function public.set_updated_at();
  end if;
end $$;
