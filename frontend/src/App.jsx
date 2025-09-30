import { Routes, Route } from "react-router-dom"; // solo Routes y Route
import Home from "./pages/Home.jsx";
import DifficultySelection from "./pages/DifficultySelection.jsx";
import Dashboard from "./pages/Dashboard";
import Ruleta from "./pages/Ruleta.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/DifficultySelection" element={<DifficultySelection />} />
      <Route path="/Ruleta" element={<Ruleta/>} />
      <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;