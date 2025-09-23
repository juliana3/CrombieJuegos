import "../pages/css/home.css"
import headerImg from '../pages/img/logo.png';

export default function Home() {
  return (
    <div className="home-container">

        <img className="header-img" src={headerImg} alt="Header" />

      {/* Main Content - Botón central */}
      <main className="main-content">
        <button
          className="start-game-button"
          onClick={() => {
            // Aquí puedes agregar la lógica para iniciar el juego
            console.log("Iniciar juego clicked")
          }}
        >
          Iniciar Juego:
        </button>
      </main>

      {/* Footer Section - Botón gestor */}
      <footer className="footer-section">
        <button
          className="gestor-button"
          onClick={() => {
            // Aquí puedes agregar la lógica para el gestor
            console.log("Gestor clicked")
          }}
        >
          gestor
        </button>
      </footer>
    </div>
  )
}
