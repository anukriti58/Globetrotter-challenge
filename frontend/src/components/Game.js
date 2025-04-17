import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Feedback from './Feedback';
import Facts from './Facts';
import UsernameModal from './UsernameModal';
import decryptPayload from '../utils/decrypt';
import '../css/Game.css';

const Game = () => {
  const [gameData, setGameData] = useState(null);
  const [guess, setGuess] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [showModal, setShowModal] = useState(!localStorage.getItem('username'));
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Start new game
  const startGame = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/game`);
      const decrypted = decryptPayload(res);
      if (decrypted) {
        setGameData(decrypted);
        setGuess(null);
        setResult(null);
      } else {
        throw new Error('Decryption failed');
      }
    } catch (err) {
      console.error('Error starting game:', err);
      alert('Failed to load game. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Handle guess
  const handleGuess = async (city) => {
    if (!gameData) return;
    setGuess(city);
    setLoading(true);
    try {
      const isCorrect = city === gameData.correct || false;
      const res = await axios.post(`${API_URL}/get-facts`, {
        isCorrect,
        city: gameData.correct
      });
      const decrypted = decryptPayload(res);
      if (decrypted) {
        setResult(decrypted);
        const newScore = {
          correct: decrypted.correct ? score.correct + 1 : score.correct,
          incorrect: !decrypted.correct ? score.incorrect + 1 : score.incorrect
        };
        setScore(newScore);
        // Save score
        await axios.post(`${API_URL}/score`, {
          username,
          score: newScore
        });
      } else {
        throw new Error('Decryption failed');
      }
    } catch (err) {
      console.error('Error submitting guess:', err);
      alert('Failed to submit guess. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset for next round
  const resetGame = () => {
    setGameData(null);
    setGuess(null);
    setResult(null);
    startGame();
  };

  // Handle username submission
  const handleUsernameSubmit = (name) => {
    setUsername(name);
    localStorage.setItem('username', name);
    setShowModal(false);
  };

  // Load game on mount
  useEffect(() => {
    if (!showModal) {
      startGame();
    }
  }, [showModal, startGame]);

  if (showModal) {
    return <UsernameModal onSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="game">
      <h2>Guess the City!</h2>
      <div className="score">
        <span>Correct: {score.correct}</span>
        <span>Incorrect: {score.incorrect}</span>
      </div>
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="clues">
            {gameData?.clues.map((clue, index) => (
              <p key={index}>{clue}</p>
            ))}
          </div>
          <div className="options">
            {gameData?.options.map((city) => (
              <button
                key={city}
                onClick={() => handleGuess(city)}
                disabled={guess !== null || loading}
              >
                {city}
              </button>
            ))}
          </div>
          {result && (
            <Feedback
              result={result}
              onNext={resetGame}
              username={username}
              score={score}
            />
          )}
          {result && (<Facts facts={result?.fun_facts} trivia={result?.trivia} />)}
        </>
      )}
    </div>
  );
};

export default Game;