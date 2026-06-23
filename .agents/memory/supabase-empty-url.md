---
name: Supabase empty URL crash
description: createClient from @supabase/supabase-js throws synchronously when supabaseUrl is empty or falsy, crashing the entire module graph.
---

## Rule
Never call `createClient("", ...)` — it throws `"supabaseUrl is required."` synchronously at module import time, which crashes the entire React app silently (no visible browser errors, just a blank page with the CSS background visible).

**Why:** The module crash happens before React mounts, so there are no React error boundaries to catch it. The CSS still loads (it's a `<link>` or `@import`), giving the illusion the page "half-loaded".

**How to apply:** When env vars might be missing (e.g. dev environment without `.env`), use a dummy/placeholder URL + key so `createClient` doesn't throw:
```ts
const MISSING = !supabaseUrl || !supabaseAnonKey;
export const supabase = MISSING
  ? createClient("https://placeholder.supabase.co", "eyJ...placeholder")
  : createClient(supabaseUrl, supabaseAnonKey, { ... });
```
This lets the app load and show content; Supabase calls will simply fail at network level (ERR_NAME_NOT_RESOLVED) rather than crashing the app.
