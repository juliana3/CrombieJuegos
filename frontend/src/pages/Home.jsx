import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../pages/css/home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <img className="header-img" src="cropped2.svg" alt="Logo" />

      <main className="main-content">
        <button
          className="start-game-button"
          onClick={() => navigate("/DifficultySelection")}
        >
          Iniciar Juego
        </button>
      </main>
     
      <footer className="footer-section">
        <button
          className="gestor-button"
          onClick={() => navigate("/Preguntas")}
        >
          Gestionar Preguntas
        </button>
        <button
          className='gestor-button'
          onClick={() => navigate("/GestorPremios")}
        >
          Gestionar Premios
        </button>
      </footer>
    </div>
  );
}
