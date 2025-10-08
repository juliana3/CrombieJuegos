import React, { createContext, useContext, useState } from 'react';

const DEFAULT_GAME_CONTEXT = {
    difficulty: null, // Incluye 'difficulty'
    setGameDifficulty: () => { /* no-op */ } 
};

const GameContext = createContext(DEFAULT_GAME_CONTEXT);

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [difficulty, setDifficulty] = useState(null);
  
  const setGameDifficulty = (nivel) => {
    setDifficulty(nivel);
  };

  return (
    <GameContext.Provider value={{ difficulty, setGameDifficulty }}>
      {children}
    </GameContext.Provider>
  );
};

// NOTA: Debes envolver tu aplicación (ej. en App.js) con <GameProvider>