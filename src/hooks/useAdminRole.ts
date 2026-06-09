import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * useAdminRole — returns { isAdmin, userId, loading } and keeps in sync with auth state.
 * Checks the public.user_roles table for a role='admin' row for the current user.
 */
export function useAdminRole() {
  const [state, setState] = useState<{ isAdmin: boolean; userId: string | null; loading: boolean }>(
    { isAdmin: false, userId: null, loading: true },
  );

  useEffect(() => {
    let active = true;

    const check = async (uid: string | null) => {
      if (!uid) {
        if (active) setState({ isAdmin: false, userId: null, loading: false });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (active) setState({ isAdmin: !!data, userId: uid, loading: false });
    };

    supabase.auth.getSession().then(({ data }) => {
      check(data.session?.user?.id ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
