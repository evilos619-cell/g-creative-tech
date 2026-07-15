-- Backend schema alignment for G-Creative Tech
-- Creates missing tables and columns required by the frontend admin CRUD flows.

create extension if not exists pgcrypto;

create type if not exists public.app_role as enum ('admin', 'user');

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

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

-- Profiles table for account metadata and admin features.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists website text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

alter table public.profiles enable row level security;
grant select on public.profiles to authenticated;
grant insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

drop policy if exists "Users can view profiles" on public.profiles;
create policy "Users can view profiles" on public.profiles for select to authenticated using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile" on public.profiles for delete to authenticated using (auth.uid() = id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- User roles table for admin gating.
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles add column if not exists created_at timestamptz not null default now();
alter table public.user_roles add column if not exists updated_at timestamptz not null default now();

alter table public.user_roles enable row level security;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

drop policy if exists "Users read own role" on public.user_roles;
create policy "Users read own role" on public.user_roles for select to authenticated using (auth.uid() = user_id);

drop trigger if exists user_roles_set_updated_at on public.user_roles;
create trigger user_roles_set_updated_at
before update on public.user_roles
for each row execute function public.set_updated_at();

-- Portfolio categories.
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

alter table public.portfolio_categories enable row level security;
grant select on public.portfolio_categories to anon, authenticated;
grant all on public.portfolio_categories to service_role, authenticated;

drop policy if exists "Public read categories" on public.portfolio_categories;
create policy "Public read categories" on public.portfolio_categories for select using (true);

drop policy if exists "Admins manage categories" on public.portfolio_categories;
create policy "Admins manage categories" on public.portfolio_categories for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'portfolio_categories_slug_key') then
    alter table public.portfolio_categories add constraint portfolio_categories_slug_key unique (slug);
  end if;
end $$;

create unique index if not exists portfolio_categories_slug_unique on public.portfolio_categories (slug);

drop trigger if exists portfolio_categories_set_updated_at on public.portfolio_categories;
create trigger portfolio_categories_set_updated_at
before update on public.portfolio_categories
for each row execute function public.set_updated_at();

insert into public.portfolio_categories (name, slug)
values
  ('Website Design', 'website-design'),
  ('Web Development', 'web-development'),
  ('Branding', 'branding'),
  ('Graphics Design', 'graphics-design'),
  ('Social Media', 'social-media'),
  ('Electronics Repairs', 'electronics-repairs'),
  ('Digital Marketing', 'digital-marketing'),
  ('Other', 'other')
on conflict (slug) do nothing;

-- Portfolio items.
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

alter table public.portfolio_items enable row level security;
grant select on public.portfolio_items to anon, authenticated;
grant all on public.portfolio_items to service_role, authenticated;

drop policy if exists "Public read published items" on public.portfolio_items;
create policy "Public read published items" on public.portfolio_items for select using (published = true or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage items" on public.portfolio_items;
create policy "Admins manage items" on public.portfolio_items for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

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

drop trigger if exists portfolio_items_set_updated_at on public.portfolio_items;
create trigger portfolio_items_set_updated_at
before update on public.portfolio_items
for each row execute function public.set_updated_at();

-- Recent projects.
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

alter table public.recent_projects enable row level security;
grant select on public.recent_projects to anon, authenticated;
grant all on public.recent_projects to service_role, authenticated;

drop policy if exists "Public read projects" on public.recent_projects;
create policy "Public read projects" on public.recent_projects for select using (published = true or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage projects" on public.recent_projects;
create policy "Admins manage projects" on public.recent_projects for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists recent_projects_set_updated_at on public.recent_projects;
create trigger recent_projects_set_updated_at
before update on public.recent_projects
for each row execute function public.set_updated_at();

-- Testimonials.
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

alter table public.testimonials enable row level security;
grant select on public.testimonials to anon, authenticated;
grant all on public.testimonials to service_role, authenticated;

drop policy if exists "Public read enabled" on public.testimonials;
create policy "Public read enabled" on public.testimonials for select using (enabled = true or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials" on public.testimonials for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

-- Team members.
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  description text,
  photo_url text,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.team_members add column if not exists description text;
alter table public.team_members add column if not exists photo_url text;
alter table public.team_members add column if not exists sort_order int not null default 0;
alter table public.team_members add column if not exists published boolean not null default false;
alter table public.team_members add column if not exists created_at timestamptz not null default now();
alter table public.team_members add column if not exists updated_at timestamptz not null default now();

alter table public.team_members enable row level security;
grant select on public.team_members to anon, authenticated;
grant all on public.team_members to service_role, authenticated;

drop policy if exists "Public read published members" on public.team_members;
create policy "Public read published members" on public.team_members for select using (published = true or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage members" on public.team_members;
create policy "Admins manage members" on public.team_members for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

-- Service requests.
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

alter table public.service_requests enable row level security;
grant insert on public.service_requests to anon, authenticated;
grant select, update, delete on public.service_requests to authenticated;
grant all on public.service_requests to service_role;

drop policy if exists "Anyone can submit" on public.service_requests;
create policy "Anyone can submit" on public.service_requests for insert with check (true);

drop policy if exists "Admins read requests" on public.service_requests;
create policy "Admins read requests" on public.service_requests for select to authenticated using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage requests" on public.service_requests;
create policy "Admins manage requests" on public.service_requests for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists service_requests_set_updated_at on public.service_requests;
create trigger service_requests_set_updated_at
before update on public.service_requests
for each row execute function public.set_updated_at();

-- Contact messages.
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

alter table public.contact_messages enable row level security;
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;

drop policy if exists "Anyone can send" on public.contact_messages;
create policy "Anyone can send" on public.contact_messages for insert with check (true);

drop policy if exists "Admins read messages" on public.contact_messages;
create policy "Admins read messages" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage messages" on public.contact_messages;
create policy "Admins manage messages" on public.contact_messages for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

-- Settings table for site configuration.
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

alter table public.settings enable row level security;
grant select on public.settings to anon, authenticated;
grant all on public.settings to service_role, authenticated;

drop policy if exists "Public read settings" on public.settings;
create policy "Public read settings" on public.settings for select using (true);

drop policy if exists "Admins manage settings" on public.settings;
create policy "Admins manage settings" on public.settings for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

-- Auto-promote owner email to admin (idempotent).
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created_promote_owner'
  ) then
    create or replace function public.auto_promote_owner()
    returns trigger
    language plpgsql
    security definer
    set search_path = public
    as $$
    begin
      if new.email = 'goodnesschukwuma619@gmail.com' then
        insert into public.user_roles (user_id, role)
        values (new.id, 'admin')
        on conflict (user_id, role) do nothing;
      end if;
      return new;
    end;
    $$;

    create trigger on_auth_user_created_promote_owner
    after insert on auth.users
    for each row execute function public.auto_promote_owner();
  end if;
end $$;

insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where email = 'goodnesschukwuma619@gmail.com'
on conflict (user_id, role) do nothing;

-- Storage bucket and object policies.
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
