// PaginaPremio.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../components/contexto/gameContext.jsx'; 
import './css/premioCard.css';

export default function PaginaPremio() {
  const [premio, setPremio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagenCargada, setImagenCargada] = useState(false); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { difficulty } = useGame(); 

  const premioSonido = useMemo(() => {
    return new Audio('/premio.mp3'); 
  }, []);
  
  useEffect(() => {
    obtenerYAsignarPremio();
  }, []);

  useEffect(() => {
    if (premio && !loading) {
      premioSonido.play();
    }
  }, [premio, loading, premioSonido]);

  const obtenerYAsignarPremio = async () => {
    try {
      setLoading(true);
      
      // Obtener premios activos
      const response = await fetch('/api/premios/activos');
      if (!response.ok) throw new Error('Error al obtener premios');
      
      const premios = await response.json();
      
      if (!premios || premios.length === 0) {
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

  
  const handlePlayAgain = () => {
    navigate(`/registro/${difficulty}`);
  };

  const handleImageLoad = () => {
    setImagenCargada(true);
  };

  //Aplica la visibilidad en base al estado de la imagen.
  const contentClass = imagenCargada 
    ? 'premio-card-content-visible' 
    : 'premio-card-content-hidden';

  if (loading || !premio || error) {
    
        // Si hay un error, mostramos el error
        if (error) {
            return (
                <div className="premio-card-container">
                    <div className="error-message">⚠️ {error}</div>
                </div>
            );
        } 

        // Si estamos en la carga inicial (descontando stock), mostramos el spinner
        return (
            <div className="premio-card-container">
                <div className="loading-overlay">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div className="loading-spinner-circle"></div> 
                        <div className="loading-message" style={{marginTop: '20px'}}>
                            {/* El mensaje es "Eligiendo premio..." o "Cargando..." */}
                            Cargando premio...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

  return (
        <div className="premio-card-container">
            {/* Spinner de carga sobrepuesto mientras se descarga la imagen (Solo si NO está cargada) */}
            {!imagenCargada && (
                <div className="loading-overlay">
                    <div className="loading-content-centered"> 
                        <div className="loading-spinner-circle"></div> 
                        {/* Cambié el mensaje para reflejar la acción */}
                        <div className="loading-message" style={{marginTop: '20px'}}>Eligiendo premio...</div>
                    </div>
                </div>
        )}
            
        {/*CONTENEDOR DE TRANSICIÓN: Oculta el contenido hasta que la imagen esté lista */}
        <div className={contentClass}> 
            
            {/* Letrero GANASTE */}
            <img className="ganaste-badge" src="/Ganaste.svg" alt="ganaste" />

            {/* Premio */}
            <div className="premio-display">
                {/* Renderiza la imagen y espera el evento onLoad */}
                {premio.imagen ? (
                    <img 
                        // 💡 CAMBIO DE URL: Usa el ID de Drive
                        src={getImageUrl(premio.imagen)} 
                        alt={premio.nombre}
                        className={`premio-imagen ${premio.nombre === 'Vaso térmico' ? 'size-small' : ''}`}
                        onLoad={handleImageLoad} // Dispara el estado de visibilidad
                    />
                ) : (
                    // Placeholder si no hay imagen (se considera cargado inmediatamente para mostrar el resto)
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
    </div>
    );
}