import { supabase } from "../utils/supabase";

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return error ? error.message : null;
}

export async function signUpWithPassword(
  email: string,
  password: string,
): Promise<string | null> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  return error ? error.message : null;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
