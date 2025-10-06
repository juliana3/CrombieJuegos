// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DifficultySelection from './pages/DifficultySelection';
import Dashboard from './pages/Dashboard';
import Ruleta from './pages/Ruleta';
import Configuracion from './pages/Configuracion';
import './App.css';

function App() {
  return (
    <div className="app-global-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/seleccion-dificultad" element={<DifficultySelection />} />
        <Route path="/registro/:dificultad" element={<Dashboard />} />
        <Route path="/ruleta/:dificultad" element={<Ruleta />} />
      </Routes>
    </div>
  );
}

export default App;
