import { useContext } from "react";
import { AuthContext } from "./authContextCore";

// AuthContext.tsxで作成したprovider内で使えるコンテキストを取得するフック
// 例えば、sessionとかログアウト関数とかを取得できる。provider内のコンポーネントなら。
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export default useAuth;
