// src/pages/Juego.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Ruleta from "../components/juegoRuleta";
import PreguntaCard from "../components/preguntaCard";

// Obtén la URL de la API desde la variable de entorno
// const API_URL = process.env.REACT_APP_API_URL; 

const mezclarCategorias = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function Juego() {
  const navigate = useNavigate();
  const [faseDelJuego, setFaseDelJuego] = useState("cargando");
  const [dificultadElegida, setDificultadElegida] = useState(null);
  const [juegoData, setJuegoData] = useState(null);
  const [error, setError] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/data`); 
        if (!response.ok) {
          throw new Error(`Error en la carga: ${response.statusText}`);
        }
        const data = await response.json();
        setJuegoData(data);
        setFaseDelJuego("elegirDificultad");
      } catch (err) {
        console.error("No se pudo cargar la información del juego:", err);
        setError(err);
        setFaseDelJuego("error");
      }
    };
    fetchData();
  }, []);

  const categoriasDesdeAPI = juegoData ? Object.keys(juegoData.categorias) : [];
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
  
  const dificultades = ["facil", "medio", "dificil"];

  const handleElegirDificultad = (dificultad) => {
    setDificultadElegida(dificultad);
    setFaseDelJuego("ruletaCategorias");
  };

  const handleCategoriaSeleccionada = (categoria) => {
  if (categoria === "Sorteo") {
    alert("¡Felicidades! Estás participando en un sorteo.");
    navigate('/');
    return;
  }

  if (categoria === "Perdiste") {
    alert("Lo sentimos, has perdido en esta ronda.");
    navigate('/');
    return;
  }

  const preguntas = juegoData.categorias[categoria][dificultadElegida];
  const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
  
  setPreguntaActual(preguntaAleatoria);
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
      {faseDelJuego === "elegirDificultad" && (
        <>
          <h1>Selecciona una Dificultad</h1>
          {dificultades.map((dificultad) => (
            <button key={dificultad} onClick={() => handleElegirDificultad(dificultad)}>
              {dificultad.charAt(0).toUpperCase() + dificultad.slice(1)}
            </button>
          ))}
        </>
      )}

      {faseDelJuego === "ruletaCategorias" && (
        <>
          <Ruleta 
            items={categoriasConAngulos} 
            onSpinEnd={handleCategoriaSeleccionada} 
          />
        </>
      )}

      {faseDelJuego === "preguntasCard" && (
        <PreguntaCard pregunta={preguntaActual} />
      )}
    </div>
  );
}

export default Juego;