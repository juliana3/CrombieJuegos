import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaTrash, FaEdit,FaPlus } from 'react-icons/fa';
import { FaQuestion } from "react-icons/fa6";
import { GiFastBackwardButton } from "react-icons/gi";

import './gestorPreguntas.css';
import GradientText from './GradientText';

function GestorPreguntas() {
  const [categorias, setCategorias] = useState([]);
  const [preguntas, setPreguntas] = useState({});
  const [loading, setLoading] = useState(true);

  // Estado para el modal de VER/EDITAR preguntas
  const [modalOpen, setModalOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

//Estado para el modal de AGREGAR pregunta
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);

// Estado para el modal de agregar categoría ---
  const [modalAgregarCategoriaOpen, setModalAgregarCategoriaOpen] = useState(false);

//Estado para el nombre de la nueva categoría ---
  const [nuevaCategoriaNombre, setNuevaCategoriaNombre] = useState('');

  // Estado para edición de una pregunta existente
  const [preguntaEditando, setPreguntaEditando] = useState(null); // { categoria, dificultad, index, data }
  // Estado para el formulario (sirve para agregar y editar)
  const [formPregunta, setFormPregunta] = useState({
    pregunta: "",
    opciones: ["", "", "", ""],
    respuesta_correcta: 1,
    dificultad: 'facil' // Añadimos dificultad por defecto
  });

  // cargar categorías
  const fetchCategorias = () => {
    fetch("/api/categorias")
      .then(res => res.json())
      .then(data => {
        setCategorias(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar categorías:", error);
        setLoading(false);
      });
  };

  // cargar todas las preguntas
  const fetchPreguntas = () => {
    fetch("/api/preguntas")
      .then(res => res.json())
      .then(data => {
        setPreguntas(data);
      })
      .catch(error => console.error("Error al cargar preguntas:", error));
  };

  useEffect(() => {
    fetchCategorias();
    fetchPreguntas();
  }, []);

  // toggle visibilidad
  const toggleVisible = (nombre, visible) => {
    fetch(`/api/categorias/${nombre}/visibilidad/${!visible}`, {
      method: "PATCH"
    })
      .then(() => fetchCategorias())
      .catch(err => console.error("Error al cambiar visibilidad:", err));
  };

  // eliminar categoría
    const eliminarCategoria = (nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${nombre}" y todas sus preguntas?`)) {
      fetch(`/api/categorias/${nombre}`, { method: "DELETE" })
        .then(() => {
          fetchCategorias();
          fetchPreguntas();
        })
        .catch(err => console.error("Error al eliminar categoría:", err));
    }
  };
  // guardar cambios
  const guardarPregunta = () => {
    const { categoria, dificultad, index } = preguntaEditando;

    fetch(`/api/editarpreguntas/${categoria}/${dificultad}/${index}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formPregunta)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Pregunta actualizada:", data);
        fetchPreguntas();
        setPreguntaEditando(null); // cerrar editor
      })
      .catch(err => console.error("Error al guardar pregunta:", err));
  };

   
   
   // Resetear el formulario a su estado inicial
  const resetForm = () => {
    setFormPregunta({
      pregunta: '',
      opciones: ['', '', '', ''],
      respuesta_correcta: 1,
      dificultad: 'facil',
    });
  };

//
  const abrirModalAgregar = (categoria) => {
    resetForm();
    setCategoriaSeleccionada(categoria);
    setModalAgregarOpen(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregarOpen(false);
    setCategoriaSeleccionada(null);
  };
  //

    // abrir modal de edición de preguntas
  const abrirModal = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setCategoriaSeleccionada(null);
    setPreguntaEditando(null);
  };
//
//Funciones para el modal de agregar categoría ---
  const abrirModalAgregarCategoria = () => {
    setNuevaCategoriaNombre(''); // Limpia el input anterior
    setModalAgregarCategoriaOpen(true);
  };

  const cerrarModalAgregarCategoria = () => {
    setModalAgregarCategoriaOpen(false);
  };


//Agregar pregunta
   const agregarPregunta = (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    if (!categoriaSeleccionada) return;

    fetch('/api/agregarpregunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria: categoriaSeleccionada, ...formPregunta }),
    })
      .then(res => res.json())
      .then(() => {
        fetchPreguntas();
        cerrarModalAgregar(); // Cierra el modal de agregar
      })
      .catch(err => console.error('Error al agregar pregunta:', err));
  };


  // abrir formulario de edición de pregunta
  const abrirEditorPregunta = (categoria, dificultad, index, data) => {
    setPreguntaEditando({ categoria, dificultad, index });
    setFormPregunta({
      pregunta: data.pregunta,
      opciones: [...data.opciones],
      respuesta_correcta: data.respuesta_correcta
    });
  };

const agregarCategoria = (e) => {
    e.preventDefault();
    if (!nuevaCategoriaNombre.trim()) {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
    }
    fetch('/api/crearcategoria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria: nuevaCategoriaNombre }),
    })
    .then(res => {
      if (!res.ok) throw new Error('La categoría ya existe o hubo un error.');
      return res.json();
    })
    .then(() => {
      fetchCategorias(); // Actualiza la lista de categorías
      cerrarModalAgregarCategoria(); // Cierra el modal
    })
    .catch(err => {
      console.error('Error al agregar categoría:', err);
      alert(err.message);
    });
  };

  const borrarPregunta = (categoria, dificultad, index) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      fetch(`/api/preguntas/${categoria}/${dificultad}/${index}`, {
        method: 'DELETE',
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al eliminar la pregunta');
        }
        return res.json();
      })
      .then(() => {
        console.log('Pregunta eliminada con éxito');
        fetchPreguntas(); // Actualiza el estado de las preguntas
      })
      .catch(err => {
        console.error('Error en el proceso de eliminación:', err);
        alert(err.message);
      });
    }
  };



  return (
    <div>
     <div className="volver">
    <a href="/">
      <GiFastBackwardButton /> 
    </a>
  </div>
      <div className="nombre">
         <GradientText animationSpeed={12}>
          Gestor de Preguntas
        </GradientText>
        </div>
      <div className="contenido">
        <div className="categorias">
          <div className="agregar-categorias">
      <p>Categorías</p>
      <FaPlus 
        className="icon-agregar-categoria" 
        title="Agregar Categoría" 
        onClick={() => abrirModalAgregarCategoria()} 
      />
    </div>
          
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ul>
              {categorias.map((cat, index) => (
                <li key={index} className="categoria-item">
                  <span>{cat.nombre}</span>
                  <div className="acciones">
                     <FaQuestion 
                      className="icon-agregar" 
                      title="Agregar pregunta a la categoría" 
                      onClick={() => abrirModalAgregar(cat.nombre)} 
                    />

                    <FaEdit 
                      className="icon-ver" 
                      title="Editar preguntas de la categoría" 
                      onClick={() => abrirModal(cat.nombre)} 
                    />
                    {cat.visible ? (
                      <FaEye 
                        className="icon-ocultar" 
                        title="Ocultar categoría" 
                        onClick={() => toggleVisible(cat.nombre, cat.visible)} 
                      />
                    ) : (
                      <FaEyeSlash 
                        className="icon-mostrar" 
                        title="Mostrar categoría" 
                        onClick={() => toggleVisible(cat.nombre, cat.visible)} 
                      />
                    )}
                    <FaTrash 
                      className="icon-eliminar" 
                      title="Eliminar categoría" 
                      onClick={() => eliminarCategoria(cat.nombre)} 
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
{modalOpen && categoriaSeleccionada && (
  <div className="modal">
    <div className="modal-content">
      <h3>Preguntas de {categoriaSeleccionada}</h3>
      {["facil", "medio", "dificil"].map(dif => (
        <div key={dif}>
          <h4>{dif.toUpperCase()}</h4>
          <ul>
            {preguntas[categoriaSeleccionada]?.[dif]?.map((p, i) => (
              <li key={i}>
                {/* El texto de la pregunta queda fuera del div */}
                <span>{p.pregunta}</span>

                {/* Envuelve los íconos en un div para agruparlos */}
                <div className="acciones-pregunta">
                  <FaEdit
                    className="icon"
                    title="Editar esta pregunta"
                    onClick={() => abrirEditorPregunta(categoriaSeleccionada, dif, i, p)}
                  />
                  <FaTrash
                    className='icon-borrar'
                    title='Borrar esta pregunta'
                    onClick={() => borrarPregunta(categoriaSeleccionada, dif, i)}
                  />
                </div>

              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="modal-footer">
         <button onClick={cerrarModal}>Cerrar</button>
      </div>
    </div>
  </div>
)}
      
      {/* Editor de pregunta */}
      {preguntaEditando && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar pregunta</h3>
            <label>
              Pregunta:
              <input 
                type="text" 
                value={formPregunta.pregunta} 
                onChange={(e) => setFormPregunta({ ...formPregunta, pregunta: e.target.value })}
              />
            </label>

            {formPregunta.opciones.map((op, idx) => (
              <label key={idx}>
                Opción {idx + 1}:
                <input 
                  type="text" 
                  value={op} 
                  onChange={(e) => {
                    const nuevasOpciones = [...formPregunta.opciones];
                    nuevasOpciones[idx] = e.target.value;
                    setFormPregunta({ ...formPregunta, opciones: nuevasOpciones });
                  }}
                />
              </label>
            ))}

            <label>
              Respuesta correcta (1-4):
              <input 
                type="number" 
                min="1" max="4"
                value={formPregunta.respuesta_correcta} 
                onChange={(e) => setFormPregunta({ ...formPregunta, respuesta_correcta: parseInt(e.target.value, 10) })}
              />
            </label>

            <div style={{ marginTop: "10px" }}>
              <button onClick={guardarPregunta}>Guardar</button>
              <button onClick={() => setPreguntaEditando(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
       
{/* Modal para AGREGAR una pregunta */}
      {modalAgregarOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar nueva pregunta a "{categoriaSeleccionada}"</h3>
            <form onSubmit={agregarPregunta}>
              <label>
                Pregunta:
                <input required type="text" value={formPregunta.pregunta} onChange={(e) => setFormPregunta({ ...formPregunta, pregunta: e.target.value })} />
              </label>

              {formPregunta.opciones.map((op, idx) => (
                <label key={idx}>
                  Opción {idx + 1}:
                  <input required type="text" value={op} onChange={(e) => {
                      const nuevasOpciones = [...formPregunta.opciones];
                      nuevasOpciones[idx] = e.target.value;
                      setFormPregunta({ ...formPregunta, opciones: nuevasOpciones });
                    }}
                  />
                </label>
              ))}

              <label>
                Respuesta correcta (1-4):
                <input required type="number" min="1" max="4" value={formPregunta.respuesta_correcta} onChange={(e) => setFormPregunta({ ...formPregunta, respuesta_correcta: parseInt(e.target.value, 10) })} />
              </label>

              <label>
                Dificultad:
                <select value={formPregunta.dificultad} onChange={(e) => setFormPregunta({ ...formPregunta, dificultad: e.target.value })}>
                  <option value="facil">Fácil</option>
                  <option value="medio">Medio</option>
                  <option value="dificil">Difícil</option>
                </select>
              </label>

              <div style={{ marginTop: "20px" }}>
                <button type="submit">Agregar Pregunta</button>
                <button type="button" onClick={cerrarModalAgregar}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/*Modal para AGREGAR una Categoría --- */}
      {modalAgregarCategoriaOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Nueva Categoría</h3>
            <form onSubmit={agregarCategoria}>
              <label>
                Nombre de la Categoría:
                <input
                  type="text"
                  value={nuevaCategoriaNombre}
                  onChange={(e) => setNuevaCategoriaNombre(e.target.value)}
                  placeholder="Ej: Ciberseguridad"
                  required
                  autoFocus
                />
              </label>
              <div style={{ marginTop: "20px" }}>
                <button type="submit">Agregar Categoría</button>
                <button type="button" onClick={cerrarModalAgregarCategoria}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default GestorPreguntas;
