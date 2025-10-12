import React, { useState, useEffect } from "react";
import "./css/Dashboard.css";
import { useNavigate, useParams } from "react-router-dom";
import { GiFastBackwardButton } from "react-icons/gi";


function Dashboard() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [premiosDisponibles, setPremiosDisponibles] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para gestionar el envío

  const navigate = useNavigate();
  const { dificultad: dificultadElegida } = useParams();

  useEffect(() => {
    verificarPremiosDisponibles();
  }, []);

  const verificarPremiosDisponibles = async () => {
    try {
      const response = await fetch('/api/premios/activos');
      if (!response.ok) throw new Error('Error al verificar premios');
      
      const premios = await response.json();
      
      if (!premios || premios.length === 0) {
        setPremiosDisponibles(false);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error verificando premios:', error);
      setPremiosDisponibles(false);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dificultadElegida) {
      console.error("Error: Dificultad no encontrada en la URL.");
      return;
    }

    const payload = { nombre, apellido, email };
    setIsSubmitting(true); // Activar el estado de "enviando"

    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error en la solicitud");

      const data = await response.json();
      navigate(`/ruleta/${dificultadElegida}`);
    } catch (error) {
      console.error("Error:", error);
      navigate(`/ruleta/${dificultadElegida}`);
    } finally {
      setIsSubmitting(false); // Desactivar el estado de "enviando"
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-premios">Verificando disponibilidad...</div>
      </div>
    );
  }

  if (!premiosDisponibles) {
    return (
      <div className="dashboard-container">
        <div className="cro">
          <img className="cropped2-img" src="/cropped2.svg" alt="Logo" />
        </div>
        <div className="no-premios-alert">
          <h2>⚠️ Se terminaron los premios!</h2>
          <button 
            className="continuar-button"
            onClick={() => navigate('/')}>
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }
    
  const manejarVolver = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    
    <div className="dashboard-container">
          <button className="back-arrow" onClick={manejarVolver}>
              <GiFastBackwardButton />
            </button>
            
      <div className="cro">
        <img className="cropped2-img" src="/cropped2.svg" alt="Logo" />
      </div>

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido"
          required
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>
          <input type="checkbox" required />
          Acepto los términos y condiciones.
          <button
            type="button"
            className="info-button"
            onClick={() => setShowModal(true)}
          >
            ?
          </button>
        </label>

        <button 
          type="submit" 
          className="continuar-button"
          disabled={isSubmitting} // Desactivar el botón si está enviando
        >
          {isSubmitting ? 'Cargando...' : 'Continuar'}
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Términos y Condiciones</h2>
            <p>
              Crombie se compromete a proteger y respetar tu privacidad, y solo usaremos tu información personal para administrar tu cuenta y proporcionar información sobre contenidos que puedan interesarte.
            </p>
            <button className="close-button" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;