import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export type AuthContextValue = {
  session: Session | null;
  userId: string | null;
  loading: boolean;
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<string | null>;
  signUpWithPassword: (
    email: string,
    password: string,
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
