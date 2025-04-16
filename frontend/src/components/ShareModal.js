import { useState, useEffect } from 'react';
import { WhatsappShareButton } from 'react-share';
import '../css/ShareModal.css';

const ShareModal = ({ username, score, shareUrl, shareMessage, onClose }) => {
  const [countdown, setCountdown] = useState(30);


  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          document.querySelector('.whatsapp-share-button')?.click();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="share-modal">
      <div className="share-modal-content">
        <h2>Challenge Your Friends!</h2>
        <p>Share your score with them:</p>
        <p>
          Correct: {score.correct} | Incorrect: {score.incorrect}
        </p>
        <div className="countdown">
          <div className="countdown-circle">
            <svg>
              <circle cx="50" cy="50" r="45" />
            </svg>
            <span>{countdown}s</span>
          </div>
          <p>Auto-sharing in {countdown} seconds...</p>
        </div>
        <div className="share-modal-buttons">
          <WhatsappShareButton
            url={shareUrl}
            title={shareMessage}
            separator=" "
            className="whatsapp-share-button"
            onClick={onClose}
          >
            <span>Share Now</span>
          </WhatsappShareButton>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;