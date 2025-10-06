import "./css/home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      <img className="header-img" src="cropped2.svg" alt="Logo" />

      {/* Main Content - Botón central */}
      <main className="main-content">
        <button
          className="start-game-button"
          onClick={() => navigate("/seleccion-dificultad")} // 👈 ahora navega
        >
          Iniciar Juego
        </button>
      </main>

      {/* Footer Section - Botón gestor */}
      <footer className="footer-section">
        <button
          className="gestor-button"
          onClick={() => navigate()} // 👈 ahora navega
        >
          Ajustes
        </button>
      </footer>
    </div>
  );
}
