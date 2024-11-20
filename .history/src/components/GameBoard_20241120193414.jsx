import React, { useState, useEffect } from "react";
import { useControls } from "leva";
import { connectedWords } from "../resources";

// Utility function to shuffle words
const shuffleArray = (array) => {
  return array
    .map((item) => ({ word: item, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((item) => item.word);
};

const GameBoard = () => {
  // Leva Controller
  const { groupSize, itemCount, columns } = useControls({
    groupSize: { value: 2, min: 2, max: 4, step: 1 },
    itemCount: { value: 4, min: 4, max: 12, step: 1 },
    columns: { value: 3, min: 2, max: 4, step: 1 },
  });

  const [attempts, setAttempts] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [matchedWords, setMatchedWords] = useState([]);
  const [words, setWords] = useState([]);
  const [incorrectSelection, setIncorrectSelection] = useState(false);

  useEffect(() => {
    // Dynamically calculate the required number of groups
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
    setIncorrectSelection(false); // Reset incorrect selection state
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
          setTimeout(() => {
            setWords((prevWords) =>
              prevWords.filter((w) => !newSelection.includes(w))
            );
            setSelectedWords([]);
          }, 1000);
        } else {
          setIncorrectSelection(true); // Set incorrect selection state
          setTimeout(() => {
            setSelectedWords([]);
            setIncorrectSelection(false); // Reset incorrect selection state after a delay
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        {/* Reset Button */}
        <div className="mb-4">
          <button
            onClick={resetGame}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Reset Game
          </button>
        </div>

        {/* Attempts Counter */}
        <div className="mb-4">
          <span className="text-gray-700 text-lg font-medium">
            Attempts: {attempts}
          </span>
        </div>

        {/* Game Board */}
        <div
          className="grid gap-4 mt-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {words.map((word, index) => (
            <div
              key={index}
              onClick={() => handleWordClick(word)}
              className={`p-4 border rounded-lg text-center cursor-pointer transition duration-300 ${
                selectedWords.includes(word)
                  ? "bg-teal-300" // Blue/Teal for initially selected words
                  : ""
              } ${
                matchedWords.includes(word)
                  ? "bg-green-300 cursor-default" // Green for matched words
                  : ""
              } ${
                incorrectSelection &&
                !matchedWords.includes(word) &&
                selectedWords.includes(word)
                  ? "bg-red-300" // Light red for incorrect selection
                  : ""
              } hover:bg-teal-200`}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
