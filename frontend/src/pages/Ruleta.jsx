import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import JuegoRuleta from "../components/juegoRuleta";
import PreguntaCard from "../components/preguntaCard";
import "./css/Ruleta.css";

// Obtén la URL de la API desde la variable de entorno
// const API_URL = process.env.REACT_APP_API_URL; 

const mezclarCategorias = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function Ruleta() {
  const navigate = useNavigate();
  const { dificultad: dificultadElegida } = useParams(); 
  const [faseDelJuego, setFaseDelJuego] = useState("cargando");
  const [juegoData, setJuegoData] = useState(null);
  const [error, setError] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const { width, height } = useWindowSize(); 

  useEffect(() => {
    if (!dificultadElegida) {
      console.error("No se proporcionó la dificultad en la URL.");
      // Podrías redirigir a la página de selección de dificultad o a la Home
      // navigate('/'); 
      setFaseDelJuego("error");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch('/api/preguntas'); 
        if (!response.ok) {
          throw new Error(`Error en la carga: ${response.statusText}`);
        }
        const data = await response.json();
        setJuegoData(data);
        setFaseDelJuego("ruletaCategorias");
      } catch (err) {
        console.error("No se pudo cargar la información del juego:", err);
        setError(err);
        setFaseDelJuego("error");
      }
    };
    fetchData();
  }, [dificultadElegida]);

  const categoriasDesdeAPI = juegoData ? Object.keys(juegoData) : [];
  const categoriasAMezclar = [...categoriasDesdeAPI.slice(0, 3), "Sorteo", "Sorteo", "Perdiste", "Perdiste", "Perdiste"];

  // Baraja y luego asigna los ángulos
  const categoriasConAngulos = mezclarCategorias(categoriasAMezclar).map((nombre, index, array) => {
    const totalAngulo = 360 / array.length;
    const angulo = (totalAngulo * index) + 22.5;
    return {
      nombre,
      angulo
    };
  });

  const volverALaRuleta = () => {
    setFaseDelJuego("ruletaCategorias");
  };

  const handleCategoriaSeleccionada = (categoria) => {
    if (categoria === "Sorteo") {
      setFaseDelJuego("ganasteSorteo");
      return;
    }

    if (categoria === "Perdiste") {
      setFaseDelJuego("perdisteRonda");
      return;
    }

    const preguntas = juegoData.categorias[categoria][dificultadElegida];
    if (!preguntas || preguntas.length === 0) {
        setFaseDelJuego("ruletaCategorias"); 
        return;
    }
    
    const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
    
    const preguntaConCategoria = { ...preguntaAleatoria, categoria }; 
    setPreguntaActual(preguntaConCategoria);
    setFaseDelJuego("preguntasCard");
  };
    
  if (faseDelJuego === "cargando") {
    return <div className="loading-screen">Cargando datos del juego...</div>;
  }

  if (faseDelJuego === "error") {
    return <div className="error-screen">Ocurrió un error al cargar los datos.</div>;
  }

  return (
    <div className="game-page-container">
      {faseDelJuego === "ruletaCategorias" && (
        <div className="ruleta-fase">
          <JuegoRuleta
            items={categoriasConAngulos}
            onSpinEnd={handleCategoriaSeleccionada}
          />
        </div>
      )}

      {faseDelJuego === "preguntasCard" && (
        <PreguntaCard pregunta={preguntaActual} />
      )}

      {/* FASE: Ganaste Sorteo (Tarjeta de Mensaje) */}
      {faseDelJuego === "ganasteSorteo" && (
        <div className="modal-overlay">
          <Confetti
          width={width}
          height={height}
          numberOfPieces={400} // Puedes ajustar la cantidad
          recycle={false} // ¡Importante! Hace que dispare una vez y luego desaparezca
          tweenDuration={5000} // Duración del efecto (en milisegundos)
        />
          <div className="mensaje-card sorteo-ganado">
            <button className="close-btn" onClick={volverALaRuleta}>X</button>
            <h1>🎉 ¡Felicidades! 🎉</h1>
            <p>¡Has caído en la casilla **SORTEO**! Estás participando por grandes premios.</p>
          </div>
        </div>
      )}

      {/* FASE: Perdiste Ronda (Tarjeta de Mensaje) */}
      {faseDelJuego === "perdisteRonda" && (
        <div className="modal-overlay">
          <div className="mensaje-card ronda-perdida">
            <button className="close-btn" onClick={volverALaRuleta}>X</button>
            <h1>😔 Lo Sentimos 😔</h1>
            <p> Has caído en la casilla **PERDISTE**. La ronda ha terminado para ti.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ruleta;