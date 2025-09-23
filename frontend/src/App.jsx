import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Juego from './pages/Juego';
import Configuracion from './pages/Configuracion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/juego" element={<Juego />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
    </Router>
  );
}
// function App() {
//   const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);

//   // Renderizado condicional basado en el estado.
//   const renderizarContenido = () => {
//     if (juegoSeleccionado === "ruleta") {
//       return <Ruleta />;
//     }

//     if (juegoSeleccionado === "pasaPalabra") {
//       return <PasaPalabra />;
//     }

//     return (
//       <>
//         <img src={LogoCrombie} className="logo-crombie" alt="Crombie logo" />
//         <h3>Selecciona un juego</h3>
//         <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
//           <button
//             onClick={() => setJuegoSeleccionado("ruleta")}
//             style={{
//               padding: "15px 30px",
//               fontSize: "1.2em",
//               cursor: "pointer",
//             }}
//           >
//             Ruleta
//           </button>
//           <button
//             onClick={() => setJuegoSeleccionado("pasaPalabra")}
//             style={{
//               padding: "15px 30px",
//               fontSize: "1.2em",
//               cursor: "pointer",
//             }}
//           >
//             PasaPalabra
//           </button>
//         </div>
//       </>
//     );
//   };

//   return <div className="App">{renderizarContenido()}</div>;
// }

export default App;
