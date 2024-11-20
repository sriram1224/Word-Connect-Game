// src/App.jsx
import React from "react";
import GameBoard from "./components/GameBoard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="container  mx-auto p-4">
      <h1 className="text-2xl text-orange-800 russo-one-regular font-bold mb-4">
        Word Connect Game
      </h1>
      <GameBoard />
      <ToastContainer />
    </div>
  );
};

export default App;
