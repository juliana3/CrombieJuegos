// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DifficultySelection from './pages/DifficultySelection';
import Dashboard from './pages/Dashboard';
import Ruleta from './pages/Ruleta';
import GestorPreguntas from './pages/GestorPreguntas/GestorPreguntas';
import Ganaste from './pages/premioCard';
import GestorPremios from './pages/GestorPremios';
import SlotJuego from './pages/slotJuego';

//import GestorPremios from './pages/GestorPremios';
import './App.css';

function App() {
  return (
    <div className="app-global-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seleccion-dificultad" element={<DifficultySelection />} />
        <Route path="/registro/:dificultad" element={<Dashboard />} />
        <Route path="/ruleta/:dificultad" element={<Ruleta />} />
        <Route path="/gestor-preguntas" element={<GestorPreguntas />} />
        <Route path="/ganaste" element={<Ganaste />} />
        <Route path="/gestor-premios" element={<GestorPremios />} /> 
        <Route path="/slot-juego" element={<SlotJuego />} />
      </Routes>
    </div>
  );
}

export default App;
