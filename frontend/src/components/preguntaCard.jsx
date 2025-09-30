import React from 'react';

const PreguntaCard = () => {
    return (
        <div className="premio-card">
            <h2>{GANASTE}</h2>
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
