import { useState, useEffect } from 'react';
import { WhatsappShareButton } from 'react-share';
import useTimer from '../hook/useTimer';
import '../css/ShareModal.css';

const ShareModal = ({ score, shareUrl, shareMessage, onClose }) => {

  // Countdown timer
  function whatsappClick(time) {
    if(time == 0) {   
      document.querySelector('.whatsapp-share-button')?.click();
    }
  }

  const countdown = useTimer(30, whatsappClick);
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