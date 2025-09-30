// PaginaPremio.jsx
import React, { useState, useEffect } from 'react';
import './css/premioCard.css';

export default function PaginaPremio() {
  const [premio, setPremio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        throw new Error('No hay premios disponibles');
      }

      // Seleccionar premio aleatorio
      const premioAleatorio = premios[Math.floor(Math.random() * premios.length)];
      
      // Descontar stock
      const descontarResponse = await fetch(`/api/premios/stock/${premioAleatorio.nombre}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!descontarResponse.ok) throw new Error('Error al descontar stock');
      
      setPremio(premioAleatorio);
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

  if (loading) {
    return (
      <div className="premio-card-container">
        <div className="loading-message">Cargando...</div>
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
      <div className="ganaste-badge">
        <div className="badge-border-animated">
          <div className="badge-inner">
            <h1 className="ganaste-text">¡GANASTE!</h1>
          </div>
        </div>
      </div>

      {/* Premio */}
      <div className="premio-display">
        {premio.imagen ? (
          <img 
            src={getImageUrl(premio.imagen)} 
            alt={premio.nombre}
            className="premio-imagen"
          />
        ) : (
          <div className="premio-placeholder">
            {premio.nombre}
          </div>
        )}
      </div>

      {/* Logo Crombie */}
      <div className="crombie-logo">
        <div className="logo-lines">
          <div className="line-group">
            <div className="line line-long"></div>
            <div className="line line-short"></div>
          </div>
          <div className="line-group">
            <div className="line line-long"></div>
            <div className="line line-medium"></div>
          </div>
          <div className="line-group">
            <div className="line line-long"></div>
            <div className="line line-medium-short"></div>
          </div>
        </div>
        <span className="crombie-text">Crombie</span>
      </div>
    </div>
  );
}