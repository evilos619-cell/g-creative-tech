-- ============================================================
-- G-CREATIVE TECH — Supabase Schema
-- Run this file in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run)
-- ============================================================

-- USER ROLES (admin gating)
create type if not exists public.app_role as enum ('admin', 'user');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

drop policy if exists "Users read own role" on public.user_roles;
create policy "Users read own role" on public.user_roles for select to authenticated using (auth.uid() = user_id);

-- PORTFOLIO CATEGORIES
create table if not exists public.portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);
grant select on public.portfolio_categories to anon, authenticated;
grant all on public.portfolio_categories to service_role, authenticated;
alter table public.portfolio_categories enable row level security;
drop policy if exists "Public read categories" on public.portfolio_categories;
create policy "Public read categories" on public.portfolio_categories for select using (true);
drop policy if exists "Admins manage categories" on public.portfolio_categories;
create policy "Admins manage categories" on public.portfolio_categories for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- PORTFOLIO ITEMS
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  category_id uuid references public.portfolio_categories(id) on delete set null,
  description text,
  image_url text,
  project_url text,
  client_name text,
  completed_at date,
  tags text[],
  published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.portfolio_items to anon, authenticated;
grant all on public.portfolio_items to service_role, authenticated;
alter table public.portfolio_items enable row level security;
drop policy if exists "Public read published items" on public.portfolio_items;
create policy "Public read published items" on public.portfolio_items for select using (published = true or public.has_role(auth.uid(), 'admin'));
drop policy if exists "Admins manage items" on public.portfolio_items;
create policy "Admins manage items" on public.portfolio_items for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- RECENT PROJECTS
create table if not exists public.recent_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.recent_projects to anon, authenticated;
grant all on public.recent_projects to service_role, authenticated;
alter table public.recent_projects enable row level security;
drop policy if exists "Public read projects" on public.recent_projects;
create policy "Public read projects" on public.recent_projects for select using (published = true or public.has_role(auth.uid(), 'admin'));
drop policy if exists "Admins manage projects" on public.recent_projects;
create policy "Admins manage projects" on public.recent_projects for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- TESTIMONIALS
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  role text,
  quote text not null,
  rating int not null default 5,
  logo_url text,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.testimonials to anon, authenticated;
grant all on public.testimonials to service_role, authenticated;
alter table public.testimonials enable row level security;
drop policy if exists "Public read enabled" on public.testimonials;
create policy "Public read enabled" on public.testimonials for select using (enabled = true or public.has_role(auth.uid(), 'admin'));
drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials" on public.testimonials for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- TEAM MEMBERS
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  description text,
  photo_url text,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.team_members to anon, authenticated;
grant all on public.team_members to service_role, authenticated;
alter table public.team_members enable row level security;
drop policy if exists "Public read published members" on public.team_members;
create policy "Public read published members" on public.team_members for select using (published = true or public.has_role(auth.uid(), 'admin'));
drop policy if exists "Admins manage members" on public.team_members;
create policy "Admins manage members" on public.team_members for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- SERVICE REQUESTS
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text,
  message text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
grant insert on public.service_requests to anon, authenticated;
grant select, update, delete on public.service_requests to authenticated;
grant all on public.service_requests to service_role;
alter table public.service_requests enable row level security;
drop policy if exists "Anyone can submit" on public.service_requests;
create policy "Anyone can submit" on public.service_requests for insert with check (true);
drop policy if exists "Admins read requests" on public.service_requests;
create policy "Admins read requests" on public.service_requests for select to authenticated using (public.has_role(auth.uid(), 'admin'));
drop policy if exists "Admins manage requests" on public.service_requests;
create policy "Admins manage requests" on public.service_requests for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- CONTACT MESSAGES
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
drop policy if exists "Anyone can send" on public.contact_messages;
create policy "Anyone can send" on public.contact_messages for insert with check (true);
drop policy if exists "Admins read messages" on public.contact_messages;
create policy "Admins read messages" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));
drop policy if exists "Admins manage messages" on public.contact_messages;
create policy "Admins manage messages" on public.contact_messages for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- SEED DATA
-- ============================================================
insert into public.portfolio_categories (name, slug) values
  ('Website Design', 'website-design'),
  ('Web Development', 'web-development'),
  ('Branding', 'branding'),
  ('Graphics Design', 'graphics-design'),
  ('Social Media', 'social-media'),
  ('Electronics Repairs', 'electronics-repairs'),
  ('Digital Marketing', 'digital-marketing'),
  ('Other', 'other')
on conflict (slug) do nothing;

insert into public.team_members (name, position, description, photo_url, sort_order, published) values
  (
    'GOODNESS CHUKWUMA IBEABUCHI',
    'Chief Executive Officer (CEO)',
    'Founder and Chief Executive Officer of G-Creative Tech, leading innovation, digital transformation, creative services, technology solutions, electronics repair services, and business growth initiatives.',
    null,
    0,
    true
  )
on conflict do nothing;

insert into public.testimonials (client_name, role, quote, rating, enabled) values
  ('KAMZYBOT''S MEDIA', 'Media & Content Partner', 'G-Creative Tech delivered our brand identity and website on time and on point. Total professionals.', 5, true),
  ('SAMMY STORE LOGS', 'Retail & Logs Business', 'From our store website to our daily social media, G-Creative Tech runs the digital side flawlessly.', 5, true),
  ('GOD''S GRACE SURPLUS VALUE', 'Wholesale & Supply', 'They built our online presence from scratch. Sales conversations now come in every single day.', 5, true),
  ('PAKMOIL', 'Energy & Distribution', 'Reliable, fast and creative. They understood our brand and elevated everything we put out.', 5, true),
  ('RUXLOGS', 'Logs & E-commerce', 'Smooth process, premium output. We trust G-Creative Tech with every new launch we plan.', 5, true),
  ('OG SKATTER BACK', 'Music & Entertainment', 'Branding, graphics, social media — they handled everything and made my brand stand out.', 5, true)
on conflict do nothing;

-- ============================================================
-- PROMOTE YOURSELF TO ADMIN
-- After signing up at /auth, run THIS in the SQL editor
-- with your email substituted:
--
--   insert into public.user_roles (user_id, role)
--   select id, 'admin' from auth.users where email = 'goodnesschukwuma619@gmail.com'
--   on conflict do nothing;
-- ============================================================

-- ============================================================
-- STORAGE BUCKET — media (for admin file uploads)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Public read of media files (bucket is public anyway, but explicit policy
-- is required when RLS is enforced on storage.objects).
drop policy if exists "Public read media" on storage.objects;
create policy "Public read media" on storage.objects for select
  using (bucket_id = 'media');

-- Only admins can upload, update, or delete media files.
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
