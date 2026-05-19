import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { PokemonDetail } from "./pages/PokemonDetail";
import Demo from "./pages/Demo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<PokemonDetail />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </Router>
  );
}

export default App;
