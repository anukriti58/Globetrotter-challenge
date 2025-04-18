import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Feedback from './Feedback';
import Facts from './Facts';
import UsernameModal from './UsernameModal';
import decryptPayload from '../utils/decrypt';
import useTimer from '../hook/useTimer';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import '../css/Game.css';

const Game = () => {
  const [gameData, setGameData] = useState(null);
  const [guess, setGuess] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [showModal, setShowModal] = useState(!localStorage.getItem('username'));
  const [points, setPoints] = useState(0);
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

  const { countdown, resetTimer, stopTimer } = useTimer(20, scoreCalculator);

  const handleGuess = async (city) => {
    if (!gameData) return;
    stopTimer();
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
          correct: decrypted.correct ? score.correct + points : score.correct,
          incorrect: !decrypted.correct ? score.incorrect - points : score.incorrect
        };
        setScore(newScore);
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

  function scoreCalculator(timer) {
    if (timer >= 15) {
      setPoints(50);
    } else if (timer >= 10) {
      setPoints(25);
    } else if (timer > 0) {
      setPoints(10);
    } else {
      setPoints(0);
    }
  }

  const resetGame = () => {
    setGameData(null);
    setGuess(null);
    setResult(null);
    startGame();
    resetTimer();
  };

  const handleUsernameSubmit = (name) => {
    setUsername(name);
    localStorage.setItem('username', name);
    setShowModal(false);
  };

  useEffect(() => {
    if (!showModal) {
      startGame();
    }
  }, [showModal, startGame]);

  if (showModal) {
    return <UsernameModal onSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="game" style={{ textAlign: 'center' }}>
      <h2>Guess the City!</h2>
      <div className="score">
        <span>Correct: {score.correct}</span>
        <div className="progress-bar">
          <h4>Time Left:</h4>
          <CircularProgressbar
            value={countdown}
            maxValue={20}
            text={`${countdown}s`}
            styles={buildStyles({
              textColor: '#000',
              pathColor: countdown > 15 ? 'green' : countdown > 10 ? 'orange' : 'red',
              trailColor: '#d6d6d6'
            })}
          />
        </div>
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
