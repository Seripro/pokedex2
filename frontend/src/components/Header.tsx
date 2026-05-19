import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <Link to="/">ホーム</Link>
      <Link to="/favorites">お気に入り</Link>
    </div>
  );
}

export default Header;
