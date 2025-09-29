// frontend/src/pages/DifficultySelection.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importación lateral correcta del CSS
import './css/DifficultySelection.css'; 

function DifficultySelection() {
    // La variable 'dificultad' registra la selección, aunque la advertencia de 'no usada' persista
    const navigate = useNavigate();
    const [dificultad, setDificultad] = useState('');
    const manejarSeleccion = (nivel) => {
        // La función es ahora síncrona, limpia y solo guarda el estado.
        setDificultad(nivel); 
        navigate(`/ruleta/${nivel}`);
        // Aquí es donde, en el futuro, podrías agregar la navegación:
        // navigate(`/juego/${nivel}`); 
    };

    return (
        <div className="contenedor-dificultad">
            {/* Si tienes un logo, añádelo aquí con su propia clase */}
            {/* <img src="/logo.png" alt="Crombie Logo" className="logo" /> */}
            
            <h1 className='h1'>Elegí la dificultad:</h1>
            
            <div className="botones-dificultad">
                <button className='boton-facil' onClick={() => manejarSeleccion('facil')}>Fácil</button>
                <button className='boton-intermedio' onClick={() => manejarSeleccion('intermedio')}>Intermedio</button>
                <button className='boton-dificil' onClick={() => manejarSeleccion('dificil')}>Difícil</button>
            </div>
            
            {/* Se elimina el bloque {dificultad && ...} que causaba problemas */}
        </div>
    );
}

export default DifficultySelection;