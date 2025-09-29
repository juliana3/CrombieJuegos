import React, { useState } from "react";
import "./css/Dashboard.css"; // CSS separado para estilos
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { nombre, apellido, email };

    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      console.log("Usuario creado:", data);

      // Redirigir después de presionar continuar
      navigate("/siguiente"); // Ajusta la ruta que quieras
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <div className="dashboard-container">

        <img className="dashboard-logo" src="cropped2.svg" alt="Logo" />

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="continuar-button">
          Continuar
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
