import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import DifficultySelection from "./pages/DifficultySelection.jsx";
import Dashboard from "./pages/Dashboard";
import Ruleta from "./pages/Ruleta.jsx";
import PremioCard from "./pages/premioCard.jsx";

import Preguntas from "./pages/GestorPreguntas/gestorPreguntas.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Preguntas" element={<Preguntas />} />
      <Route path="/DifficultySelection" element={<DifficultySelection />} />
      <Route path="/Ruleta" element={<Ruleta />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/PremioCard" element={<PremioCard />} /> 


      
      {/* <Route path="/GestorPremios" element={<GestorPremios />} /> */}
    </Routes>
  );
}

export default App;
