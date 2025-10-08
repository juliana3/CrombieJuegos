// PaginaPremio.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../components/contexto/gameContext.jsx'; 
import './css/premioCard.css';

export default function PaginaPremio() {
  const [premio, setPremio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noPremios, setNoPremios] = useState(false);
  const navigate = useNavigate();
  const { difficulty } = useGame(); 

  useEffect(() => {
    obtenerYAsignarPremio();
  }, []);

  const obtenerYAsignarPremio = async () => {
    try {
      setLoading(true);
      
      // Obtener premios activos
      const response = await fetch('/api/premios/activos');
      if (!response.ok) throw new Error('Error al obtener premios');
      
      const premios = await response.json();
      
      if (!premios || premios.length === 0) {
        setNoPremios(true);
        setLoading(false);
        return;
      }

      // Seleccionar premio aleatorio
      const premioAleatorio = premios[Math.floor(Math.random() * premios.length)];

      //codificar el nombre del premio para la URL
      const nombreCodificado = encodeURIComponent(premioAleatorio.nombre);
      
      // Descontar stock
      const descontarResponse = await fetch(`/api/premios/stock/${nombreCodificado}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!descontarResponse.ok) throw new Error('Error al descontar stock');
      
      setPremio(premioAleatorio);
      console.log('Premio completo:', premioAleatorio);
      console.log('URL generada:', getImageUrl(premioAleatorio.imagen));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getImageUrl = (driveId) => {
    if (!driveId) return null;
    return `/api/premios/imagen/${driveId}`;
  };

  const handleGoHome = () => {
    navigate('/'); // Redirige a la ruta raíz (Home)
  };
  
  const handlePlayAgain = () => {
    navigate(`/registro/${difficulty}`);
  };


  if (loading) {
    return (
      <div className="premio-card-container">
        <div className="loading-message">Cargando...</div>
      </div>
    );
  }

  if (noPremios) {
    return (
      <div className="premio-card-container">
        <div className="no-premios-content">
          <div className="no-premios-message">
            ⚠️ ¡Se agotaron los premios!
          </div>
          <button className="home-button" onClick={handleGoHome}>
            Volver al Inicio
          </button>
        </div>
        
      </div>
    );
  }
  if (error) {
    return (
      <div className="premio-card-container">
        <div className="error-message">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="premio-card-container">
      {/* Letrero GANASTE */}

      <img className="ganaste-badge" src="/Ganaste.svg" alt="ganaste" />


      {/* Premio */}
      <div className="premio-display">
        {premio.imagen ? (
          <img 
            src={getImageUrl(premio.imagen)} 
            alt={premio.nombre}
            className={`premio-imagen ${premio.nombre === 'Vaso térmico' ? 'size-small' : ''}`}
          />
        ) : (
          <div className="premio-placeholder">
            {premio.nombre}
          </div>
        )}
      </div>

      {/* Logo Crombie */}
    
      <img className="crombie-logo" src="/cropped2.svg" alt="Logo" />

      <div className="volver-a-jugar-content">
        <button 
            className="volver-a-jugar-btn" 
            onClick={handlePlayAgain}>
            Volver a jugar
        </button>
      </div>

    </div>
  );
}
