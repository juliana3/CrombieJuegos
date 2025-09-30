import React, { useEffect, useState } from 'react';
import './gestorPreguntas.css';

function GestorPreguntas() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
fetch('/api/categorias')
      .then(res => res.json())
      .then(data => {
        setCategorias(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar categorías:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="nombre">Gestor de Preguntas</div>
      <div className="contenido">
        <div className="categorias">
          <p>Categorías</p>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ul>
              {categorias.map((cat, index) => (
                <li key={index}>
                  {cat.nombre} {cat.visible ? "✅ Visible" : "❌ Oculta"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestorPreguntas;
