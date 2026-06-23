import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const MISSING = !supabaseUrl || !supabaseAnonKey;

if (MISSING) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
      "Create a .env file based on .env.example. Database features will be disabled."
  );
}

export const supabase = MISSING
  ? createClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder",
    )
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
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
