import React from 'react';

const PreguntaCard = ({ pregunta, opciones, onSeleccionar }) => {
    return (
        <div className="pregunta-card">
            <h2>{pregunta}</h2>
            <ul>
                {opciones.map((opcion, idx) => (
                    <li key={idx}>
                        <button onClick={() => onSeleccionar(opcion)}>
                            {opcion}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PreguntaCard;