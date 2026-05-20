import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import {
  signInWithPassword as signInWithPasswordUtil,
  signUpWithPassword as signUpWithPasswordUtil,
  signOut as signOutUtil,
} from "./authUtils";
import { AuthContext, type AuthContextValue } from "./authContextCore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) {
        return;
      }
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // providerで渡すvalueオブジェクトの作成
  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      userId: session?.user.id ?? null,
      loading,
      // サインイン、サインアップ、ログアウト関数をproviderで渡す
      signInWithPassword: signInWithPasswordUtil,
      signUpWithPassword: signUpWithPasswordUtil,
      signOut: signOutUtil,
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// note: `useAuth` hook moved to `useAuth.ts`
