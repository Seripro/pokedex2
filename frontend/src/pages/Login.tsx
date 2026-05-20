import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function Login() {
  const navigate = useNavigate();
  const { session, loading, signInWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [navigate, session]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const error = await signInWithPassword(email, password);

    if (error) {
      setErrorMessage(`ログイン失敗: ${error}`);
    } else {
      navigate("/");
    }

    setSubmitting(false);
  };

  if (loading) {
    return <div className="auth-page">認証状態を確認中...</div>;
  }

  return (
    <section className="auth-page">
      <div className="auth-backdrop auth-backdrop--login" />
      <div className="auth-card">
        <p className="auth-eyebrow">Pokédex Access</p>
        <h1>ログイン</h1>
        <p className="auth-copy">
          メールアドレスとパスワードでサインインします。
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
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
              autoComplete="current-password"
              required
            />
          </label>

          {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

          <button
            className="auth-button auth-button--primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <p className="auth-footer">
          アカウントがない場合は <Link to="/signup">会員登録</Link>
        </p>
      </div>
    </section>
  );
}
