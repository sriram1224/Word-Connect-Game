import React, { useState, useRef, useEffect } from "react";
import { connectedWords } from "../resources";

// Utility function to shuffle words
const shuffleArray = (array) => {
  return array
    .map((item) => ({ word: item, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((item) => item.word);
};

const GameBoard = () => {
  const [groupSize, setGroupSize] = useState(2);
  const [itemCount, setItemCount] = useState(5);
  const [attempts, setAttempts] = useState(0);
  const [columns, setColumns] = useState(3);
  const [selectedWords, setSelectedWords] = useState([]);
  const [matchedWords, setMatchedWords] = useState([]);
  const [words, setWords] = useState([]);
  const [incorrectSelection, setIncorrectSelection] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const availableWords = connectedWords.get(groupSize) || [];
    const flattenedWords = availableWords.flat().slice(0, itemCount);
    const shuffledWords = shuffleArray(flattenedWords);
    setWords(shuffledWords);
  }, [groupSize, itemCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFilterDropdown = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleGroupSizeChange = (e) => {
    setGroupSize(Number(e.target.value));
    resetGame();
  };

  const handleItemCountChange = (e) => {
    setItemCount(Number(e.target.value));
    resetGame();
  };

  const handleColumnsChange = (e) => {
    setColumns(Number(e.target.value));
  };

  const resetGame = () => {
    setAttempts(0);
    setMatchedWords([]);
    setSelectedWords([]);
    setIncorrectSelection(false); // Reset incorrect selection state
    const availableWords = connectedWords.get(groupSize) || [];
    const flattenedWords = availableWords.flat().slice(0, itemCount);
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
            groupSize === 3
              ? group.includes(newSelection[0]) &&
                group.includes(newSelection[1]) &&
                group.includes(newSelection[2])
              : group.includes(newSelection[0]) &&
                group.includes(newSelection[1])
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
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        {/* Filter Dropdown */}
        <div className="relative mb-4" ref={filterRef}>
          <button
            onClick={toggleFilterDropdown}
            className="bg-teal-500 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-600 transition duration-200"
          >
            Filters
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Filter 1
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Filter 2
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Filter 3
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Game Settings */}
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-medium mb-2">
            Group Size:
          </label>
          <select
            value={groupSize}
            onChange={handleGroupSizeChange}
            className="block w-full bg-gray-200 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-medium mb-2">
            Item Count:
          </label>
          <input
            type="number"
            value={itemCount}
            onChange={handleItemCountChange}
            className="block w-full bg-gray-200 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-medium mb-2">
            Columns:
          </label>
          <input
            type="number"
            value={columns}
            onChange={handleColumnsChange}
            className="block w-full bg-gray-200 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div className="mb-4">
          <button
            onClick={resetGame}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Reset
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
                selectedWords.includes(word) ? "bg-teal-300" : ""
              } ${
                matchedWords.includes(word) ? "bg-green-300 cursor-default" : ""
              } ${
                incorrectSelection &&
                !matchedWords.includes(word) &&
                selectedWords.includes(word)
                  ? "bg-red-300"
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
