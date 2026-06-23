import { createClient } from "@supabase/supabase-js";

// External Supabase project (provided by user).
// Anon/publishable key is safe to expose to the browser; RLS protects data.
const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  "https://dbqpbbexjukwurtffdzo.supabase.co";

const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicXBiYmV4anVrd3VydGZmZHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODg1MTMsImV4cCI6MjA5NjI2NDUxM30.uJFpdDSk67uTd269qZ3BsOmHUgJEV_CvU3NGEVc80I8";

// Node.js < 22 does not have native WebSocket; provide the `ws` package as transport for SSR.
async function getWebSocketImpl() {
  if (typeof WebSocket !== "undefined") return undefined;
  try {
    const ws = await import("ws");
    return ws.default ?? ws;
  } catch {
    return undefined;
  }
}

const websocketImpl = await getWebSocketImpl();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
  realtime: {
    ...(websocketImpl ? { transport: websocketImpl as any } : {}),
  },
});

export type Tables = {
  portfolio_categories: {
    id: string;
    name: string;
    slug: string;
    created_at: string;
  };
  portfolio_items: {
    id: string;
    title: string;
    slug: string;
    category_id: string | null;
    description: string | null;
    image_url: string | null;
    project_url: string | null;
    client_name: string | null;
    completed_at: string | null;
    tags: string[] | null;
    published: boolean;
    created_at: string;
  };
  recent_projects: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    image_url: string | null;
    published: boolean;
    created_at: string;
  };
  testimonials: {
    id: string;
    client_name: string;
    role: string | null;
    quote: string;
    rating: number;
    logo_url: string | null;
    enabled: boolean;
    created_at: string;
  };
  team_members: {
    id: string;
    name: string;
    position: string;
    description: string | null;
    photo_url: string | null;
    sort_order: number;
    published: boolean;
    created_at: string;
  };
  service_requests: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    service: string | null;
    message: string;
    status: "pending" | "in_progress" | "completed";
    created_at: string;
  };
  contact_messages: {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    read: boolean;
    created_at: string;
  };
  user_roles: {
    id: string;
    user_id: string;
    role: "admin" | "user";
  };
};
