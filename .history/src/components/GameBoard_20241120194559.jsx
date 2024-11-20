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
    <div className="bg-blue-400 min-h-screen flex flex-col items-center py-10">
      {/* Game Board */}
      <div
        className="grid gap-4 w-full max-w-6xl px-6"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {words.map((word, index) => (
          <div
            key={index}
            onClick={() => handleWordClick(word)}
            className={`p-6 border-2 text-white border-orange-500 rounded-lg text-center text-lg font-semibold cursor-pointer transition duration-300 ${
              selectedWords.includes(word)
                ? "bg-blue-500 text-white" // Blue for selected words
                : ""
            } ${
              matchedWords.includes(word)
                ? "bg-green-500 text-white cursor-default" // Green for matched words
                : ""
            } ${
              incorrectSelection &&
              !matchedWords.includes(word) &&
              selectedWords.includes(word)
                ? "bg-red-500 text-white" // Red for incorrect selection
                : ""
            } hover:bg-orange-400`}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Reset and Attempts Section */}
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
      </div>
    </div>
  );
};

export default GameBoard;
