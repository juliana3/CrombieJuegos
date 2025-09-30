// App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Solo necesitas estas importaciones
import Home from './pages/Home.jsx';
import GestorPreguntas from './pages/GestorPreguntas/gestorPreguntas.jsx';


// ELIMINA la definición de la función DifficultySelection() de este archivo.

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
           <Route path='/gestor' element={<GestorPreguntas/>}/>
        </Routes>
    );
}

export default App;