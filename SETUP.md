# G-Creative Tech — Setup & Admin Guide

This project is connected to your external Supabase project
(`https://dbqpbbexjukwurtffdzo.supabase.co`). The website is built on
TanStack Start and deploys automatically to Cloudflare's edge whenever
you click **Publish** in Lovable — no `wrangler.toml`, `_redirects` or
extra configuration files are needed.

> Note on the migration request: TanStack Start cannot be removed inside
> the Lovable editor without breaking the preview and publish pipeline.
> The current setup already delivers the underlying goals — deep links
> work on refresh, the site is served from Cloudflare's edge, and your
> dashboard works against your own Supabase project.

---

## 1. Run the database schema (one-time)

1. Open your Supabase dashboard → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase-schema.sql` (in the repo root).
3. Click **Run**.

This creates the tables, RLS policies and seeds the 6 testimonials,
the CEO team member, and 8 portfolio categories.

## 2. Create your admin account

1. Visit `/auth` on your site, click **Create one**, and sign up with
   `goodnesschukwuma619@gmail.com`.
2. Check your inbox and confirm the email.
3. Back in Supabase **SQL Editor**, run:

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'goodnesschukwuma619@gmail.com'
   on conflict do nothing;
   ```

4. Visit `/admin` — you should land on the dashboard.

## 3. Using the dashboard

Navigate to `/admin`. Available modules:

- **Overview** — content counts at a glance
- **Portfolio** — manage categories and portfolio items (publish/unpublish)
- **Recent Projects** — items shown on the home page
- **Testimonials** — client testimonial cards
- **Team** — crew members (only `published = true` show on /about)
- **Service Requests** — inbox for contact form submissions
- **Contact Messages** — direct messages

## 4. Environment variables (optional override)

The Supabase URL and anon key are hard-coded into
`src/integrations/supabase/client.ts` for convenience. To override, set:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=ey...
```

## 5. Publishing

Click **Publish** in Lovable (top-right). Your site goes live at
`g-creative-tech.lovable.app` and any custom domain you attach in
Project Settings → Domains.
