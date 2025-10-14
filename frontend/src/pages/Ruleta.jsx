import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import JuegoRuleta from "../components/juegoRuleta";
import SlotJuego from "./slotJuego";
import "./css/Ruleta.css";

const mezclarCategorias = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const rangosAngulos = [
  { min: 22.5, max: 67.5 },
  { min: 67.5, max: 112.5 },
  { min: 112.5, max: 157.5 },
  { min: 157.5, max: 202.5 },
  { min: 202.5, max: 247.5 },
  { min: 247.5, max: 292.5 },
  { min: 292.5, max: 337.5 },
  { min: 337.5, max: 382.5 } // cierre del círculo hasta 22.5°
];

function Ruleta() {
  const navigate = useNavigate();
  const { dificultad: dificultadElegida } = useParams(); 
  const [faseDelJuego, setFaseDelJuego] = useState("cargando");
  const [juegoData, setJuegoData] = useState(null);
  const [error, setError] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const { width, height } = useWindowSize(); 

  const ganarSonido = new Audio("/Ganaste.mp3");
  const perderSonido = new Audio("/Loserrrrr.mp3");

  useEffect(() => {
    if (!dificultadElegida) {
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

   useEffect(() => {
    if (faseDelJuego === "preguntasCard") {
     // ✅ CORRECTO: La navegación se ejecuta AHORA después del renderizado.
      navigate("/slot-juego");
    } 
    // El efecto se dispara solo cuando 'faseDelJuego' cambia.
  }, [faseDelJuego, navigate]); 

  if (faseDelJuego === "cargando") return <div className="loading-screen">Cargando datos del juego...</div>;
  if (faseDelJuego === "error") return <div className="error-screen">Ocurrió un error al cargar los datos.</div>;

  const categoriasDesdeAPI = juegoData
    ? Object.entries(juegoData)
        .filter(([_, datos]) => datos.visible === true)
        .map(([nombre]) => nombre)
        .slice(0, 3)
    : [];

  const categoriasAMezclar = [
    ...categoriasDesdeAPI,
    "Sorteo",
    "Sorteo",
    "Perdiste",
    "Perdiste",
    "Perdiste"
  ];

  // Baraja y luego asigna los ángulos
  const categoriasConAngulos = mezclarCategorias(categoriasAMezclar).map((nombre, i) => ({
    nombre,
    min: rangosAngulos[i].min,
    max: rangosAngulos[i].max
  }));

  const irARegistro = () => {
    navigate(`/registro/${dificultadElegida}`);
  };

  const handleCategoriaSeleccionada = async (categoria) => {
    if (categoria === "Sorteo") {
      try {
      const response = await fetch('/api/sorteo', { method: 'POST' });
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al registrar sorteo:', error);
    }
      ganarSonido.play();
      setFaseDelJuego("ganasteSorteo");
      return;
    }

    if (categoria === "Perdiste") {
      perderSonido.play();
      setFaseDelJuego("perdisteRonda");
      return;
    }

    const preguntas = juegoData[categoria]?.[dificultadElegida] || [];
    if (!preguntas.length) {
      setFaseDelJuego("ruletaCategorias"); 
      return;
    }
    
    const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
    setPreguntaActual({ ...preguntaAleatoria, categoria });
    setFaseDelJuego("preguntasCard");
  };
    
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
        <div className="redireccionando">Redireccionando al juego...</div>
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
            <img src="https://emojis.wiki/thumbs/emojis/star-struck.webp" alt="emoji felicitaciones" className="emoji"/>          
            <h1>¡Felicidades!</h1>
            <p>Has caído en la casilla "SORTEO"</p>
            <p>Estás participando por grandes premios.</p>
            <button className="close-btn" onClick={irARegistro}>Volver</button>
          </div>
        </div>
      )}

      {/* FASE: Perdiste Ronda (Tarjeta de Mensaje) */}
      {faseDelJuego === "perdisteRonda" && (
        <div className="modal-overlay">
          <div className="mensaje-card ronda-perdida">
            <img src="https://th.bing.com/th/id/R.4dfca1913a84cbb1b199ce3cab893696?rik=AX6%2fX6qe%2fNL%2fkg&pid=ImgRaw&r=0" alt="emoji perdiste" className="emoji"/>  
            <h1>Lo Sentimos</h1>
            <p>Has caído en la casilla "PERDISTE"</p>
            <p>La ronda ha terminado para ti.</p>
            <button className="close-btn" onClick={irARegistro}>Volver</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ruleta;