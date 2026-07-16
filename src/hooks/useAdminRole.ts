import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

    supabase.auth.getSession().then((res: any) => {
      check(res.data?.session?.user?.id ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e: any, session: any) => {
      check(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
