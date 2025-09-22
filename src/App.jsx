import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Ruleta from "./views/Ruleta";
import LogoCrombie from "./assets/Logo.png";

function App() {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);

  // Renderizado condicional basado en el estado.
  const renderizarContenido = () => {
    if (juegoSeleccionado === "ruleta") {
      return <Ruleta />;
    }

    if (juegoSeleccionado === "pasaPalabra") {
      return <PasaPalabra />;
    }

    return (
      <>
        <img src={LogoCrombie} className="logo-crombie" alt="Crombie logo" />
        <h3>Selecciona un juego</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={() => setJuegoSeleccionado("ruleta")}
            style={{
              padding: "15px 30px",
              fontSize: "1.2em",
              cursor: "pointer",
            }}
          >
            Ruleta
          </button>
          <button
            onClick={() => setJuegoSeleccionado("pasaPalabra")}
            style={{
              padding: "15px 30px",
              fontSize: "1.2em",
              cursor: "pointer",
            }}
          >
            PasaPalabra
          </button>
        </div>
      </>
    );
  };

  return <div className="App">{renderizarContenido()}</div>;
}

export default App;
