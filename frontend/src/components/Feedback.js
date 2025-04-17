import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useEffect, useRef, useState } from 'react';
import ShareModal from './ShareModal';
import '../css/Feedback.css';

const Feedback = ({ result, onNext, username, score }) => {
  const shareRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!result?.correct) {
      const audio = new Audio('/sounds/wrong.mp3');
      audio.play();
    }
  }, [result.correct]);


  const shareUrl = `${FRONTEND_URL}/invite/${encodeURIComponent(username)}`;
  const shareMessage = `${username} scored ${score.correct} correct in Globetrotter! Can you beat their score?`;
  return (
    <>
      <motion.div
        className="feedback"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          x: result.correct ? 0 : [0, -10, 10, -10, 10, 0]
        }}
        transition={{
          duration: 0.5,
          x: { duration: 0.4 }
        }}
        style={{
          margin: '20px 0',
          padding: '15px',
          background: result.correct ? '#28a745' : '#dc3545',
          color: 'white',
          borderRadius: '10px'
        }}
      >
        {result.correct && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={300}
            colors={['#ff758c', '#6dd5fa', '#ffffff']}
          />
        )}
        <div ref={shareRef}>
          <p>
            {result?.message} Here are fun facts about this place!
          </p>
          {result.correct && (
            <p>
              {username}'s Score: {score.correct} Correct, {score.incorrect} Incorrect
            </p>
          )}
        </div>
        <div className="feedback-buttons">
          <button onClick={onNext}>
            {result.correct ? 'Next City' : 'Try Again'}
          </button>
          {result.correct && (
            <button onClick={() => setShowShareModal(true)}>
              Challenge a Friend
            </button>
          )}
        </div>
      </motion.div>
      {showShareModal && (
        <ShareModal
        username={username}
        score={score}
        shareUrl={shareUrl}
        shareMessage={shareMessage}
        onClose={() => setShowShareModal(false)}
      />
      )}
    </>
  );
};

export default Feedback;