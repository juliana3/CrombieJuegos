// GestorPremios.jsx
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { FiPlusSquare } from "react-icons/fi";
import { FaRegSquareMinus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { GiFastBackwardButton } from "react-icons/gi";
// import { useNavigate } from "react-router-dom";
import "./css/GestorPremios.css";

function GestorPremios() {
  const [premios, setPremios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newNombre, setNewNombre] = useState("");
  const [newFotoFile, setNewFotoFile] = useState(null);

  const [editPremio, setEditPremio] = useState(null);
  const [editFotoFile, setEditFotoFile] = useState(null);

  // Fetch inicial
  useEffect(() => {
    fetchPremios();
  }, []);

  // CARGAR PREMIOS DESDE EL BACKEND EN FORMATO DE OBJETO
  
  async function fetchPremios() {
    setLoading(true);
    try {
      const res = await fetch("/api/premios");
      if (!res.ok) throw new Error("No se pudieron cargar los premios");

      const data = await res.json();
      console.log("Datos recibidos del backend: ", data);

      // ACEPTAR DOS FORMATOS: { premios: { ... } } o  { ... }
      const premiosObj = data.premios || data;

      // CONVERTIR EL OBJETO DEL BACKEND A UN ARRAY PARA PODER MOSTRARLO FÁCILMENTE

      if (premiosObj && typeof premiosObj === "object") {
        const arr = Object.entries(premiosObj).map(([nombre, datos]) => ({
          id: nombre,
          nombre,
          activo: datos.activo ?? false,
          stock: datos.cantidad ?? 0,
          imagen: datos.imagen ?? null,
        }));
        console.log("Premios convertidos a array: ", arr);
        setPremios(arr);
      } else {
        console.warn("No se recibió un objeto válido de premios");
        setPremios([]);
      }

    } catch (err) {
      console.error("Error al cargar premios: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }



  // FUNCION PARA ACTIVAR/DESACTIVAR PREMIO 
  const toggleVisible = async (nombre, activoActual) => {
    const nuevoValor = !activoActual; // lo que queremos poner
    try {
      const res = await fetch(`/api/premios/estado/${encodeURIComponent(nombre)}/${nuevoValor}`, {
        method: "PUT",
      });

      if (!res.ok) throw new Error("Error al cambiar estado");

      const data = await res.json();
      const premioActualizado = data.premio;

      // Actualizamos el estado local
      setPremios(prev =>
        prev.map(p =>
          p.nombre === premioActualizado.nombre ? { ...p, activo: premioActualizado.activo } : p
        )
      );
    } catch (error) {
      console.error(error);
      fetchPremios(); // fallback
    }
  };



  const incrementStock = async (nombre, cantidadActual) => {
    const nuevaCantidad = cantidadActual + 1;
    await modificarCantidad(nombre, nuevaCantidad);
  };

  const decrementStock = async (nombre, cantidadActual) => {
    const nuevaCantidad = Math.max(0, cantidadActual - 1);
    await modificarCantidad(nombre, nuevaCantidad);
  };

  const modificarCantidad = async (nombre, nuevaCantidad) => {
    try {
      const res = await fetch(`/api/premios/cantidad/${encodeURIComponent(nombre)}/${nuevaCantidad}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Error al modificar la cantidad");

      const data = await res.json();
      const premioActualizado = data.premio;

      // Actualiza el estado local para reflejar el cambio
      setPremios(prev =>
        prev.map(p =>
          p.nombre === premioActualizado.nombre
            ? { ...p, cantidad: premioActualizado.cantidad }
            : p
        )
      );

      await fetchPremios();

    } catch (error) {
      console.error("Error al modificar cantidad:", error);
    }
  };


  const deletePremio = async (nombre) => {
    if (!window.confirm("¿Seguro que querés eliminar este premio?")) return;
    const prev = premios;

    setPremios(prev.filter(p => p.nombre !== nombre)); // actualizar frontend

    try {
      const res = await fetch(`/api/premios/eliminar/${encodeURIComponent(nombre)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
    } catch {
      setPremios(prev); // revertir cambios si falla
      alert("No se pudo eliminar. Intenta de nuevo.");
    }
  };

  // agregar premio con FormData (sube archivo si existe)
  const addPremio = async () => {
    if (!newNombre.trim()) return alert("El nombre es requerido");
    const form = new FormData();
    form.append("nombre", newNombre);
    if (newFotoFile) form.append("imagen-premio", newFotoFile);

    try {
      const res = await fetch("/api/premios/crear", {
        method: "POST",
        body: form, 
      });
      if (!res.ok) throw new Error("No se pudo crear");
      const created = await res.json();
      setPremios(prev => [...prev, created.premio || created]);
      setShowAddModal(false);
      setNewNombre("");
      setNewFotoFile(null);

      await fetchPremios();

    } catch (err) {
      alert("Error al crear premio");
    }
  };

  const openEditModal = (premio) => {
    setEditPremio(premio);
    setEditFotoFile(null);
    setShowEditModal(true);
  };

  // guardar edición
  const saveEditPremio = async () => {
    if (!editPremio) return;
    const { id, nombre } = editPremio;

    try {
      let res;

      if (editFotoFile) {
        // FormData si hay nueva imagen
        const form = new FormData();
        form.append("nuevoNombre", nombre); // <- coincide con backend
        form.append("imagen-premio", editFotoFile);

        res = await fetch(`/api/premios/editar/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: form
        });

      } else {
        // JSON si solo cambias el nombre
        res = await fetch(`/api/premios/editar/${encodeURIComponent(id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nuevoNombre: nombre }), // <- coincide con backend
        });
      }

      if (!res.ok) throw new Error("No se pudo guardar");

      // 🔹 Recargar lista para reflejar cambios correctamente
      fetchPremios();

      setShowEditModal(false);
      setEditPremio(null);
      setEditFotoFile(null);

    } catch (err) {
      alert("Error al guardar la edición");
      console.error(err);
      fetchPremios(); // fallback
    }
  };

  // render
  return (
    <main className="main-gestor-premios">
      <div className="back-arrow" onClick={() => window.history.back()}>
        <a href="/">
          <GiFastBackwardButton /> 
        </a>
      </div>

      <h2 className="gradient-text">
        Gestor de Premios
      </h2>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className="lista-premios">
        {premios.length > 0 ? (
          premios.map((premio) => (
            <li key={premio.id} className="premio-item">
              {/* Nombre */}
              <span className="nombre-premio">{premio.nombre}</span>

              {/* Estado activo/inactivo */}
              <span
                className="icon toggle-visibility"
                title={premio.activo ? "Ocultar" : "Mostrar"}
                onClick={() => toggleVisible(premio.nombre, premio.activo)}
              >
                {premio.activo ? <FaEye /> : <FaEyeSlash />}
              </span>

              {/* Editar */}
              <span
                className="icon edit"
                title="Editar"
                onClick={() => openEditModal(premio)}
              >
                <IoPencil />
              </span>

              {/* Eliminar */}
              <span
                className="icon delete"
                title="Eliminar"
                onClick={() => deletePremio(premio.nombre)}
              >
                <MdDeleteOutline />
              </span>

              {/* Control de stock */}
              <div className="stock-control">
                <span
                  className="icon minus"
                  title="Disminuir stock"
                  onClick={() => decrementStock(premio.nombre, premio.stock)}
                >
                  <FaRegSquareMinus />
                </span>

                <span className="stock">{premio.stock}</span>

                <span
                  className="icon plus"
                  title="Aumentar stock"
                  onClick={() => incrementStock(premio.nombre, premio.stock)}
                >
                  <FiPlusSquare />
                </span>
              </div>
            </li>
          ))
        ) : (
          <p>No hay premios cargados</p>
        )}
      </ul>

      <button className="add-button" onClick={() => setShowAddModal(true)}>+ Agregar Premio</button>

      {/* Modal agregar */}
      {showAddModal && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h2>Agregar Premio</h2>
            <label>
              Nombre
              <input type="text" value={newNombre} onChange={(e) => setNewNombre(e.target.value)} />
            </label>
            <label>
              Foto
              <input type="file" accept="image/*" onChange={(e) => setNewFotoFile(e.target.files[0] || null)} />
            </label>
            <div>
              <button type="button" onClick={addPremio}>Guardar</button>
              <button type="button" onClick={() => setShowAddModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {showEditModal && editPremio && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h2>Editar Premio</h2>
            <label>
              Nombre
              <input
                type="text"
                value={editPremio.nombre}
                onChange={(e) => setEditPremio({ ...editPremio, nombre: e.target.value })}
              />
            </label>
            <label>
              Foto (opcional)
              <input type="file" accept="image/*" onChange={(e) => setEditFotoFile(e.target.files[0] || null)} />
            </label>
            <div>
              <button type="button" onClick={saveEditPremio}>Guardar</button>
              <button type="button" onClick={() => { setShowEditModal(false); setEditPremio(null); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default GestorPremios;