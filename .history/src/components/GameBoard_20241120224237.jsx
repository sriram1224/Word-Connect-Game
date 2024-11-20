import React, { useState, useEffect } from "react";
import { useControls } from "leva";
import { connectedWords } from "../resources";
import { toast } from "react-toastify";

const shuffleArray = (array) => {
  return array
    .map((item) => ({ word: item, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((item) => item.word);
};

const GameBoard = () => {
  const [showShareModal, setShowShareModal] = useState(false);

  const { groupSize, itemCount, columns } = useControls({
    groupSize: { value: 2, min: 2, max: 4, step: 1 },
    itemCount: { value: 8, min: 4, max: 16, step: 1 },
    columns: { value: 4, min: 2, max: 4, step: 1 },
  });

  const [attempts, setAttempts] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [matchedWords, setMatchedWords] = useState([]);
  const [words, setWords] = useState([]);
  const [incorrectSelection, setIncorrectSelection] = useState(false);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  useEffect(() => {
    const savedScore = localStorage.getItem("highScore");
    if (savedScore) {
      setHighestScore(parseInt(savedScore, 10));
    }

    const availableWords = connectedWords.get(groupSize) || [];
    const requiredWords = availableWords.slice(0, itemCount);
    const flattenedWords = requiredWords.flat();
    const shuffledWords = shuffleArray(flattenedWords);
    setWords(shuffledWords);
  }, [groupSize, itemCount]);

  const resetGame = () => {
    setAttempts(0);
    setMatchedWords([]);
    setSelectedWords([]);
    setIncorrectSelection(false);
    setScore(0);
    const availableWords = connectedWords.get(groupSize) || [];
    const requiredWords = availableWords.slice(0, itemCount);
    const flattenedWords = requiredWords.flat();
    const shuffledWords = shuffleArray(flattenedWords);
    setWords(shuffledWords);
  };

  const handleWordClick = (word) => {
    if (selectedWords.length < groupSize && !selectedWords.includes(word)) {
      const newSelection = [...selectedWords, word];
      setSelectedWords(newSelection);

      if (newSelection.length === groupSize) {
        setAttempts((prev) => prev + 1);

        const isMatch = connectedWords
          .get(groupSize)
          ?.some((group) =>
            group.every((gWord) => newSelection.includes(gWord))
          );

        if (isMatch) {
          setMatchedWords((prev) => [...prev, ...newSelection]);
          const newScore = score + 10;
          setScore(newScore);

          if (newScore > highestScore) {
            setHighestScore(newScore);
            localStorage.setItem("highScore", newScore);
            toast.success("New High Score!", { autoClose: 1000 });
          }

          setTimeout(() => {
            setWords((prevWords) =>
              prevWords.filter((w) => !newSelection.includes(w))
            );
            setSelectedWords([]);
          }, 1000);
        } else {
          setIncorrectSelection(true);
          setTimeout(() => {
            setSelectedWords([]);
            setIncorrectSelection(false);
          }, 1000);
        }
      }
    }
  };

  const shareMessage = `I scored the highest score of ${highestScore} in the word count game! Come and play this game.`;

  return (
    <div className=" min-h-screen flex flex-col items-center py-10">
      {/* Game Board */}
      <div
        className="grid gap-4 w-full max-w-6xl px-6"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {words.map((word, index) => (
          <div
            key={index}
            onClick={() => handleWordClick(word)}
            className={`p-6 border-2 border-orange-500 rounded-lg text-center text-lg font-semibold cursor-pointer transition duration-300 ${
              selectedWords.includes(word) ? "bg-blue-500 text-white" : ""
            } ${
              matchedWords.includes(word)
                ? "bg-green-500 text-white cursor-default"
                : ""
            } ${
              incorrectSelection &&
              !matchedWords.includes(word) &&
              selectedWords.includes(word)
                ? "bg-red-500 text-white"
                : ""
            } hover:bg-orange-400`}
          >
            {word}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={resetGame}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition duration-200"
        >
          Reset Game
        </button>
        <p className="text-blue-500 text-lg font-medium mt-4">
          Attempts: {attempts}
        </p>
        <p className="text-blue-500 text-lg font-medium mt-4">
          Current Score: {score}
        </p>
        <p className="text-blue-500 text-lg font-medium mt-4">
          Highest Score: {highestScore}
        </p>
      </div>

      <div className=" flex flex-col items-center py-10">
        <div
          onClick={() => setShowShareModal(true)}
          className=" border rounded-lg text-2xl pr-2 border-orange-200 flex flex-row gap-2 items-center cursor-pointer"
        >
          <i className="fa-solid fa-share text-4xl p-2  rounded-lg bg-orange-300 cursor-pointer"></i>
          <p className="russo-one-regular"> Share Your Highest Score</p>
        </div>

        {showShareModal && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
              <span
                className="material-symbols-outlined cursor-pointer text-gray-500 hover:text-gray-700 text-2xl absolute top-4 right-4"
                onClick={() => setShowShareModal(false)}
              >
                close
              </span>
              <p className="text-2xl font-semibold text-center text-gray-800 mb-6">
                {shareMessage}
              </p>
              <div className="flex justify-center gap-8 mb-6">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    shareMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                >
                  <i className="fa-brands fa-x-twitter text-4xl"></i>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}&quote=${encodeURIComponent(shareMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  <i className="fa-brands fa-facebook text-4xl"></i>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    shareMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-700 transition-colors duration-300"
                >
                  <i className="fa-brands fa-whatsapp text-4xl"></i>
                </a>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    navigator.clipboard.writeText(shareMessage);
                    toast.success("Copied!", {
                      autoClose: 1000,
                    });
                  }}
                  className="text-purple-500 hover:text-purple-700 transition-colors duration-300"
                >
                  <i className="fa-regular fa-copy text-4xl"></i>
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="bg-gray-800 text-white rounded-lg py-2 px-6 text-lg hover:bg-gray-700 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
