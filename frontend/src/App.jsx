import { Routes, Route } from "react-router-dom"; // solo Routes y Route
import Home from "./pages/Home.jsx";
import Juego from "./pages/Juego.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
