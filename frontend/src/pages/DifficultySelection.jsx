import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/DifficultySelection.css'; 
import Dashboard from "./Dashboard";

function DifficultySelection() {
    const [dificultad, setDificultad] = useState('');
    const navigate = useNavigate();

    const manejarSeleccion = (nivel) => {
        setDificultad(nivel);
        navigate(`/registro/${nivel}`);
    };

    return (
        <div className="contenedor-dificultad">

            <img className="header-img-Difficulty" src="cropped2.svg" alt="Logo" />

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

export default DifficultySelection;
