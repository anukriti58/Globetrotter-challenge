import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Game from './Game';
import decryptPayload from '../utils/decrypt';

const Invite = () => {
  const { username } = useParams();
  const [inviterScore, setInviterScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = useCallback(process.env.REACT_APP_API_URL || 'http://localhost:5000', []);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await axios.get(`${API_URL}/score/${username}`);
        const decrypted = decryptPayload(res);
        if (decrypted) {
          setInviterScore(decrypted);
        } else {
          setInviterScore({ correct: 0, incorrect: 0 });
        }
      } catch (err) {
        console.error('Error fetching score:', err);
        setInviterScore({ correct: 0, incorrect: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [username, API_URL]);

  return (
    <div>
      <div style={{ textAlign: 'center'}}> 
      <h2>Challenge from {decodeURIComponent(username)}!</h2>
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading score...</p>
        </div>
      ) : (
        inviterScore && (
          <p style={{ backgroundColor: 'gray', padding: '10px', borderRadius: '5px', display: 'inline-block'}}>
            Their Score: {inviterScore.correct} Correct, {inviterScore.incorrect} Incorrect
          </p>
        )
      )}
      </div>
      <Game />
    </div>
  );
};

export default Invite;