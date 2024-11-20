// src/App.jsx
import React from "react";
import GameBoard from "./components/GameBoard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="container  mx-auto p-4">
      <GameBoard />
      <ToastContainer />
    </div>
  );
};

export default App;