import { supabase } from "../utils/supabase";

export async function fetchWithAuth(input: string, options: RequestInit = {}) {
  // sessionを取得。ここはprovider配下のコンポーネントではないためsupabaseクライアントから直接取得する
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, {
    ...options,
    headers,
  });
}
