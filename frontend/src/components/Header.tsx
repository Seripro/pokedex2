import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Header() {
  const { session, signOut } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header__brand">
        <Link to="/" className="site-header__title">
          Pokédex
        </Link>
      </div>
      <nav className="site-header__nav">
        <Link to="/">ホーム</Link>
        <Link to="/favorites">お気に入り</Link>
        {session ? (
          <button
            type="button"
            className="site-header__button"
            onClick={signOut}
          >
            ログアウト
          </button>
        ) : (
          <Link to="/login">ログイン</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
