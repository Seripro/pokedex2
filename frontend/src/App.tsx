import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { PokemonDetail } from "./pages/PokemonDetail";
import Demo from "./pages/Demo";
import Favorites from "./pages/Favorites";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<PokemonDetail />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
