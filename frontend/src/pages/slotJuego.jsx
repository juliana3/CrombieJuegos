// src/views/slotJuego.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../components/contexto/gameContext.jsx";
import "./css/slotJuego.css";

export default function QuestionSlotMachine({ onQuestionComplete, correctAnswers }) {
  // 1. DECLARACIÓN DE TODOS LOS HOOKS (Incondicionalmente)
  const { difficulty } = useGame();
  const navigate = useNavigate();

  // 📦 Estados principales
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [spinningQuestions, setSpinningQuestions] = useState(["", "", ""]);
  const [hasStarted, setHasStarted] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [localCorrectCount, setLocalCorrectCount] = useState(0); // 🆕 Estado local

  // ⏱ Referencia para el intervalo
  const spinIntervalRef = useRef(null);

  // 🧩 Lógica de preparación
  const dificultadNormalizada =
    difficulty === "intermedio" ? "medio" : difficulty || "facil";
  const categoriaSeleccionada = "Frontend";

  // 🎯 Calculamos las preguntas disponibles (useMemo para estabilidad)
  const questions = useMemo(() => {
    return (
      data?.[categoriaSeleccionada]?.[dificultadNormalizada]?.map((q) => ({
        question: q.pregunta,
        options: q.opciones,
        correctAnswer: parseInt(q.respuesta_correcta, 10) - 1,
      })) || []
    );
  }, [data, dificultadNormalizada, categoriaSeleccionada]);

  // 🎰 Inicia la animación del slot (useCallback)
  const startSlotMachine = useCallback(() => {
    if (isSpinning || questions.length === 0) return;

    setHasStarted(true);
    setIsSpinning(true);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);

    // Lógica del giro
    spinIntervalRef.current = setInterval(() => {
      const randomQuestions = Array.from({ length: 3 }, () => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        return questions[randomIndex].question;
      });
      setSpinningQuestions(randomQuestions);
    }, 100);

    // Detiene el giro y selecciona la pregunta final (2 segundos después)
    setTimeout(() => {
      clearInterval(spinIntervalRef.current);
      setIsSpinning(false);

      // Seleccionar una pregunta que NO se haya usado
      let randomIndex;
      let finalQuestion;
      let attempts = 0;
      const maxAttempts = questions.length * 2;

      do {
        randomIndex = Math.floor(Math.random() * questions.length);
        finalQuestion = questions[randomIndex];
        attempts++;
      } while (
        usedQuestions.includes(finalQuestion.question) && 
        attempts < maxAttempts
      );

      setCurrentQuestion(finalQuestion);
      setUsedQuestions(prev => [...prev, finalQuestion.question]);

      setSpinningQuestions([
        "Pregunta final seleccionada...",
        finalQuestion.question,
        "¡A responder!",
      ]);
    }, 2000);
  }, [isSpinning, questions, usedQuestions]);

  // 🔹 useEffect 1: Fetch de datos
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const res = await fetch("/api/preguntas");
        const json = await res.json();
        setData(json); 
      } catch (err) {
        console.error("Error al obtener preguntas:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPreguntas();
  }, []);

  // 🎬 useEffect 2: Lanza la máquina automáticamente al montar
  useEffect(() => {
    if (!loading && questions.length > 0 && !hasStarted) {
      const timer = setTimeout(() => {
        startSlotMachine();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading, questions.length, hasStarted, startSlotMachine]);
  
  // 🧠 Maneja selección de respuestas
  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    console.log("Respuesta:", correct ? "Correcta" : "Incorrecta"); // 🆕 Debug

    // Espera 2 segundos y toma acción
    setTimeout(() => {
      if (correct) {
        // ✅ Respuesta correcta
        const newCorrectCount = localCorrectCount + 1;
        setLocalCorrectCount(newCorrectCount);
        
        console.log(`Respuestas correctas: ${newCorrectCount}/3`); // 🆕 Debug
        
        // Notificar al padre (si existe la función)
        if (onQuestionComplete) {
          onQuestionComplete(true);
        }
        
        if (newCorrectCount === 3) {
          // 🎉 Ganó el juego
          console.log("¡GANASTE! Navegando a /ganaste"); // 🆕 Debug
          setTimeout(() => {
            navigate("/ganaste");
          }, 1000);
        } else {
          // 🔄 Continuar con otra pregunta
          console.log("Iniciando nueva pregunta..."); // 🆕 Debug
          setTimeout(() => {
            startSlotMachine();
          }, 1000);
        }
      } else {
        // ❌ Respuesta incorrecta - Perdió
        console.log("Respuesta incorrecta. Navegando a /perdiste"); // 🆕 Debug
        
        // Notificar al padre (si existe la función)
        if (onQuestionComplete) {
          onQuestionComplete(false);
        }
        
        setTimeout(() => {
          navigate("/perdiste");
        }, 2000);
      }
    }, 2000);
  };

  // 🧹 Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, []);

  // 2. RENDERIZADO CONDICIONAL TEMPRANO (Carga y Error)
  if (loading) {
    return (
      <div className="slot-container">
        <div className="card">
          <p>Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (!data || questions.length === 0) {
    return (
      <div className="slot-container">
        <div className="card">
          <p>No hay suficientes preguntas disponibles para la dificultad seleccionada 😢</p>
        </div>
      </div>
    );
  }

  // 3. RENDERIZADO PRINCIPAL
  return (
    <div className="slot-container">
      <div className="card">
        <h3>Slot Machine de Preguntas</h3>

        {isSpinning ? (
          // RAMA 1: MODO GIRO (3 cajas grandes)
          <>
            <p className="loading">Seleccionando pregunta...</p>
            <div className={`spin-list ${isSpinning ? "is-spinning" : ""}`}>
              {spinningQuestions.map((text, index) => (
                <div key={index} className="spin-item">
                  <div className="spin-content">
                    {text && <p className="spin-line">{text}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : currentQuestion ? (
          // RAMA 2: MODO RESPUESTA (1 caja pequeña + 4 botones)
          <>
            <div className="question-box">
              <span>{currentQuestion.question}</span>
            </div>

            <div className="options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`option-btn
                    ${
                      selectedAnswer === index &&
                      index === currentQuestion.correctAnswer
                        ? "correct"
                        : ""
                    }
                    ${
                      selectedAnswer === index &&
                      index !== currentQuestion.correctAnswer
                        ? "incorrect"
                        : ""
                    }
                  `}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>

            {showResult && (
              <div className={`result ${isCorrect ? "correct" : "incorrect"}`}>
                {isCorrect ? "¡Correcto! 🎉" : "Lo siento, perdiste 😢"}
              </div>
            )}
          </>
        ) : (
          // RAMA 3: Estado inicial (se mostrará brevemente)
          <p className="loading">Preparando pregunta...</p>
        )}
      </div>

      <div className="card">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(localCorrectCount / 3) * 100}%` }}
          />
        </div>
        <p className="progress-text">{localCorrectCount}/3 respuestas correctas</p>
      </div>
    </div>
  );
}