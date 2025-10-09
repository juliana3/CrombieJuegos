import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../components/contexto/gameContext';
import { GiFastBackwardButton } from "react-icons/gi";
import './css/DifficultySelection.css';

export default function DifficultySelection() {
  const navigate = useNavigate();
  const { setGameDifficulty } = useGame();
  
  const manejarSeleccion = (nivel) => {
    console.log("Dificultad seleccionada:", nivel);
    
    // Guarda la dificultad en el Contexto
    setGameDifficulty(nivel);
    
    // Navega a la página de juego
    navigate(`/registro/${nivel}`);
  };
  
  const manejarVolver = () => {
    navigate(-1); // Vuelve a la página anterior
  };
  
  return (
    <div className="contenedor-dificultad">
      <button className="back-arrow" onClick={manejarVolver}>
        <GiFastBackwardButton />
      </button>
      
      <h1 className='h1'>Elegí la dificultad:</h1>
      
      <div className="botones-dificultad">
        <button
          className='boton-facil'
          onClick={() => manejarSeleccion('facil')}
        >
          Fácil
        </button>
        <button
          className='boton-intermedio'
          onClick={() => manejarSeleccion('intermedio')}
        >
          Intermedio
        </button>
        <button
          className='boton-dificil'
          onClick={() => manejarSeleccion('dificil')}
        >
          Difícil
        </button>
      </div>
    </div>
  );
}