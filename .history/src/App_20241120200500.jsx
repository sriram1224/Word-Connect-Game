// src/App.jsx
import React from "react";
import GameBoard from "./components/GameBoard";

const App = () => {
  return (
    <div className="container bg-white mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Word Connect Game</h1>
      <GameBoard />
    </div>
  );
};

export default App;
