import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { PokemonDetail } from "./pages/PokemonDetail";
import Demo from "./pages/Demo";
import Favorites from "./pages/Favorites";
import Layout from "./components/Layout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

function RequireAuth() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>認証状態を確認中...</div>;
  }

  // ログイン状態じゃない時はloginに遷移させる
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function GuestOnlyRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>認証状態を確認中...</div>;
  }

  // ログインしていたら / に飛ばす。
  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<GuestOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/detail/:id" element={<PokemonDetail />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
