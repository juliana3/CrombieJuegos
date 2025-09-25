import { useEffect, useState } from 'react';
import { getPreguntas } from '../services/apiPreguntas'; // Importa la función de API

function Juego() {
  const [preguntas, setPreguntas] = useState([]);
  useEffect(() => {
    const fetchPreguntas = async () => {
      const data = await getPreguntas();
      setPreguntas(data);
    };
    fetchPreguntas();
  }, []);

}