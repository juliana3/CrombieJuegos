import "../pages/css/home.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="home-container">
      {/* Header con logo */}
      <header className="header-section">
        <img className="header-img" src="cropped2.svg" alt="Logo" />
      </header>

      {/* Main Content - Botón central */}
      <main className="main-content">
        <button
          className="start-game-button"
          onClick={() => navigate("/seleccion-dificultad")}
        >
          Iniciar Juego
        </button>
      </main>

      {/* Footer Section - Botón gestor */}
      <footer className="footer-section">
        <button
          className="gestor-button"
          onClick={() => setShowSettings(true)}
        >
          Ajustes
        </button>
      </footer>

      {/* Modal de ajustes */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="start-game-button"
              onClick={() => navigate("/gestor-premios")}
            >
              Gestor Premios
            </button>
            <button
              className="start-game-button"
              onClick={() => navigate("/gestor-preguntas")}
            >
              Gestor Preguntas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}