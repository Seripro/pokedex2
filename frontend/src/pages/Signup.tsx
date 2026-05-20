import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function Signup() {
  const navigate = useNavigate();
  const { session, loading, signUpWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // App.tsxでsessionがあれば / に飛ばしているからいらないような。
  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [navigate, session]);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setMessage("");

    const error = await signUpWithPassword(email, password);

    if (error) {
      setErrorMessage(`会員登録失敗: ${error}`);
    } else {
      setMessage(
        "登録リクエストを送信しました。メール確認が必要な設定の場合は受信箱を確認してください。",
      );
    }

    setSubmitting(false);
  };

  if (loading) {
    return <div className="auth-page">認証状態を確認中...</div>;
  }

  return (
    <section className="auth-page">
      <div className="auth-backdrop auth-backdrop--signup" />
      <div className="auth-card">
        <p className="auth-eyebrow">Pokédex Access</p>
        <h1>会員登録</h1>

        <form className="auth-form" onSubmit={handleSignup}>
          <label>
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            パスワード
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上を推奨"
              autoComplete="new-password"
              required
            />
          </label>

          {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
          {message ? <p className="auth-message">{message}</p> : null}

          <button
            className="auth-button auth-button--primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "登録中..." : "会員登録"}
          </button>
        </form>

        <p className="auth-footer">
          すでにアカウントがある場合は <Link to="/login">ログイン</Link>
        </p>
      </div>
    </section>
  );
}
