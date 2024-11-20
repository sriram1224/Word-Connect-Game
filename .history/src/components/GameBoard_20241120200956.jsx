import React, { useState, useEffect } from "react";
import { connectedWords } from "../resources";

const shuffleArray = (array) =>
  array
    .map((item) => ({ word: item, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((item) => item.word);

const GameBoard = () => {
  const [groupSize, setGroupSize] = useState(2);
  const [itemCount, setItemCount] = useState(4);
  const [attempts, setAttempts] = useState(0);
  const [columns, setColumns] = useState(3);
  const [selectedWords, setSelectedWords] = useState([]);
  const [matchedWords, setMatchedWords] = useState([]);
  const [words, setWords] = useState([]);
  const [highestScore, setHighestScore] = useState(
    Number(localStorage.getItem("highestScore")) || 0
  );

  useEffect(() => {
    const availableWords = connectedWords.get(groupSize) || [];
    const flattenedWords = availableWords
      .flat()
      .slice(0, itemCount * groupSize);
    const shuffledWords = shuffleArray(flattenedWords);
    setWords(shuffledWords);
  }, [groupSize, itemCount]);

  useEffect(() => {
    if (matchedWords.length === words.length && words.length > 0) {
      const currentScore = Math.max(words.length / groupSize - attempts, 0);
      if (currentScore > highestScore) {
        setHighestScore(currentScore);
        localStorage.setItem("highestScore", currentScore);
      }
    }
  }, [matchedWords, attempts, words.length, groupSize, highestScore]);

  const resetGame = () => {
    setAttempts(0);
    setMatchedWords([]);
    setSelectedWords([]);
    const availableWords = connectedWords.get(groupSize) || [];
    const flattenedWords = availableWords
      .flat()
      .slice(0, itemCount * groupSize);
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
            newSelection.every((selectedWord) => group.includes(selectedWord))
          );

        if (isMatch) {
          setMatchedWords((prev) => [...prev, ...newSelection]);
          setTimeout(() => setSelectedWords([]), 1000);
        } else {
          setTimeout(() => setSelectedWords([]), 1000);
        }
      }
    }
  };

  const shareResult = (platform) => {
    const score = matchedWords.length / groupSize;
    const message = `I scored ${score} in the Word Match game! Can you beat my score?`;

    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        message
      )}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        message
      )}`;
    } else if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-orange-500">
        Word Match Game
      </h1>
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
                ? "bg-blue-500"
                : matchedWords.includes(word)
                ? "bg-green-500"
                : ""
            } hover:bg-blue-400`}
          >
            {word}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={resetGame}
          className="bg-orange-500 text-black py-2 px-4 rounded-lg hover:bg-orange-600"
        >
          Reset
        </button>
        <span className="text-lg">
          Attempts: <span className="text-orange-400">{attempts}</span>
        </span>
      </div>
      <div className="mt-4 text-lg">
        <span>Highest Score: </span>
        <span className="text-orange-400">{highestScore}</span>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => shareResult("twitter")}
          className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
        >
          Share on Twitter
        </button>
        <button
          onClick={() => shareResult("facebook")}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Share on Facebook
        </button>
        <button
          onClick={() => shareResult("whatsapp")}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default GameBoard;
