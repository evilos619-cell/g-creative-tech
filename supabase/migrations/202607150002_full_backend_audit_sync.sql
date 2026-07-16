-- Full backend audit and sync for G-Creative Tech
-- Covers portfolio categories, portfolio items, testimonials, team members, recent projects, storage, and admin-friendly defaults.

create extension if not exists pgcrypto;

create type if not exists public.app_role as enum ('admin', 'user');

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

-- Portfolio categories: ensure slug exists, unique, and populated.
create table if not exists public.portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_categories add column if not exists slug text;
alter table public.portfolio_categories add column if not exists created_at timestamptz not null default now();
alter table public.portfolio_categories add column if not exists updated_at timestamptz not null default now();

update public.portfolio_categories
set slug = lower(regexp_replace(coalesce(nullif(trim(slug), ''), name), '[^a-z0-9]+', '-', 'g'))
where slug is null or trim(slug) = '';

with ranked as (
  select
    id,
    lower(regexp_replace(coalesce(nullif(trim(slug), ''), name), '[^a-z0-9]+', '-', 'g')) as base_slug,
    row_number() over (
      partition by lower(regexp_replace(coalesce(nullif(trim(slug), ''), name), '[^a-z0-9]+', '-', 'g'))
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
where pc.id = ranked.id;

alter table public.portfolio_categories alter column slug set not null;

create unique index if not exists portfolio_categories_slug_unique on public.portfolio_categories (slug);

-- Portfolio items: full CRUD table needed by the admin UI and public portfolio page.
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

alter table public.portfolio_items add column if not exists slug text;
alter table public.portfolio_items add column if not exists category_id uuid;
alter table public.portfolio_items add column if not exists description text;
alter table public.portfolio_items add column if not exists image_url text;
alter table public.portfolio_items add column if not exists project_url text;
alter table public.portfolio_items add column if not exists client_name text;
alter table public.portfolio_items add column if not exists completed_at date;
alter table public.portfolio_items add column if not exists tags text[];
alter table public.portfolio_items add column if not exists published boolean not null default true;
alter table public.portfolio_items add column if not exists created_at timestamptz not null default now();
alter table public.portfolio_items add column if not exists updated_at timestamptz not null default now();

alter table public.portfolio_items alter column description drop not null;
alter table public.portfolio_items alter column published set default true;

alter table public.portfolio_items
  add constraint portfolio_items_category_id_fkey
  foreign key (category_id) references public.portfolio_categories(id) on delete set null;

create index if not exists portfolio_items_category_id_idx on public.portfolio_items (category_id);
create index if not exists portfolio_items_published_idx on public.portfolio_items (published, created_at desc);

drop trigger if exists portfolio_items_set_updated_at on public.portfolio_items;
create trigger portfolio_items_set_updated_at
before update on public.portfolio_items
for each row execute function public.set_updated_at();

-- Recent projects: description should be nullable so admin saves do not fail.
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
alter table public.recent_projects add column if not exists category text;
alter table public.recent_projects add column if not exists image_url text;
alter table public.recent_projects add column if not exists published boolean not null default true;
alter table public.recent_projects add column if not exists created_at timestamptz not null default now();
alter table public.recent_projects add column if not exists updated_at timestamptz not null default now();

alter table public.recent_projects alter column description drop not null;

-- Testimonials: enable boolean default true.
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

alter table public.testimonials add column if not exists role text;
alter table public.testimonials add column if not exists quote text;
alter table public.testimonials add column if not exists rating int not null default 5;
alter table public.testimonials add column if not exists logo_url text;
alter table public.testimonials add column if not exists enabled boolean not null default true;
alter table public.testimonials add column if not exists created_at timestamptz not null default now();
alter table public.testimonials add column if not exists updated_at timestamptz not null default now();

update public.testimonials set enabled = true where enabled is null;

alter table public.testimonials alter column enabled set default true;
alter table public.testimonials alter column enabled set not null;

-- Team members: use description as the primary public field and preserve bio as optional legacy column.
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
alter table public.team_members add column if not exists photo_url text;
alter table public.team_members add column if not exists sort_order int not null default 0;
alter table public.team_members add column if not exists published boolean not null default false;
alter table public.team_members add column if not exists created_at timestamptz not null default now();
alter table public.team_members add column if not exists updated_at timestamptz not null default now();

update public.team_members
set description = coalesce(nullif(trim(description), ''), nullif(trim(bio), ''), description)
where description is null and bio is not null;

alter table public.team_members alter column bio drop not null;
alter table public.team_members alter column bio set default null;

create index if not exists team_members_published_sort_idx on public.team_members (published, sort_order, created_at desc);

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

-- Service requests and contact messages remain available for admin workflows.
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text,
  message text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_requests add column if not exists phone text;
alter table public.service_requests add column if not exists service text;
alter table public.service_requests add column if not exists message text;
alter table public.service_requests add column if not exists status text not null default 'pending';
alter table public.service_requests add column if not exists created_at timestamptz not null default now();
alter table public.service_requests add column if not exists updated_at timestamptz not null default now();

drop trigger if exists service_requests_set_updated_at on public.service_requests;
create trigger service_requests_set_updated_at
before update on public.service_requests
for each row execute function public.set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_messages add column if not exists subject text;
alter table public.contact_messages add column if not exists message text;
alter table public.contact_messages add column if not exists read boolean not null default false;
alter table public.contact_messages add column if not exists created_at timestamptz not null default now();
alter table public.contact_messages add column if not exists updated_at timestamptz not null default now();

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

-- Settings table for admin configuration values.
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.settings add column if not exists key text;
alter table public.settings add column if not exists value jsonb not null default '{}'::jsonb;
alter table public.settings add column if not exists description text;
alter table public.settings add column if not exists created_at timestamptz not null default now();
alter table public.settings add column if not exists updated_at timestamptz not null default now();

create unique index if not exists settings_key_unique on public.settings (key);

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

-- Storage bucket for admin uploads.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "Admins upload media" on storage.objects;
create policy "Admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins update media" on storage.objects;
create policy "Admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins delete media" on storage.objects;
create policy "Admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
