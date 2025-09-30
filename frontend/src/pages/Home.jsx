import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../pages/css/home.css";
// No necesitas importar una ruta, importarás el componente en el Router
// import rutaGestorPreguntas from './GestorPreguntas/gestorPreguntas';

export default function Home() {
  const navigate = useNavigate();

  const iniciarJuego = () => {
    navigate('/difficulty');
  };

  const irAlGestor = () => {
    navigate('/gestor');
  };

  return (
    <div className="home-container">
      <img className="header-img" src="cropped2.svg" alt="Logo"/>

      <main className="main-content">
        <button
          className="start-game-button"
          onClick={iniciarJuego}
        >
          Iniciar Juego
        </button>
       
        <button
          className="gestor-button"
          onClick={irAlGestor}
        >
          Ir al Gestor
        </button>
        
      </main>

      <footer className="footer-section">
        <button
          className="gestor-button"
          onClick={() => {
            console.log("Gestor clicked")
          }}
        >
          gestor
        </button>
      </footer>
    </div>
  );
}
