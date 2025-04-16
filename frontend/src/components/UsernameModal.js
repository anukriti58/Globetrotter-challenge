import { useState } from 'react';
import '../css/UsernameModal.css';

const UsernameModal = ({ onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Welcome to Globetrotter!</h2>
        <p>Enter a unique username to start playing:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            required
          />
          <button type="submit">Start Game</button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;