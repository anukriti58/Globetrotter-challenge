Globetrotter Challenge
A vibrant, travel-themed quiz game where players guess cities based on clues, earn scores, and challenge friends via WhatsApp. Built with React and Express, this app features engaging audio feedback for incorrect guesses, confetti animations for correct ones, and a secure, responsive UI, showcasing frontend expertise in creating interactive experiences.
Features

City Guessing Game: Guess cities from 1-2 clues with multiple-choice options.
Feedback:
Correct Answers: Celebrated with confetti animations.
Incorrect Answers: Accompanied by a buzzer sound (wrong.mp3).


Secure APIs: All endpoints (/game, /guess, /score, /score/:username) use AES encryption to protect data.
Share Modal: Share scores via WhatsApp with a 30-second countdown, offering "Share Now" or "Cancel" options.
Loaders: Spinners ensure smooth UX during API calls on slow networks.
Invite System: Share links like /invite/username to challenge friends, displaying their scores.
Responsive UI: Features gradients, animations (confetti, countdown SVG), and a clean, mobile-friendly design.

Tech Stack

Frontend: React, React Router, Framer Motion (confetti), Crypto-JS (decryption), React-Share (WhatsApp).
Backend: Express, Node.js crypto (encryption).
Assets: wrong.mp3 for incorrect guesses, cities.json for game data.

Setup Instructions
Prerequisites

Node.js (v16+)
npm (v8+)
Git

Installation

Clone the Repository:
git clone <repository-url>
cd globetrotter-challenge


Backend Setup:

Navigate to backend:
cd backend


Install dependencies:
npm install


Ensure cities.json is in backend/ (contains clues, facts, trivia).

Start server:
node index.js

Runs on http://localhost:5000.



Frontend Setup:

Navigate to frontend:
cd frontend


Install dependencies:
npm install


Place wrong.mp3 in frontend/public/sounds/.

Source from freesound.org or soundbible.com (e.g., "Buzzer").


Start development server:
npm start

Runs on http://localhost:3000.



Verify:

Visit http://localhost:3000.
Enter a username, play, hear buzzer for wrong answers, see confetti for correct ones, and share scores.



Usage

Play the Game:

Enter a username (saved in localStorage).
Read 1-2 clues and choose a city from 4 options.
Correct guesses trigger confetti; incorrect ones play a buzzer sound.


Track Scores:

Correct: +1 to correct score.
Incorrect: +1 to incorrect score.
Scores saved per username.


Challenge Friends:

After a correct guess, click "Challenge a Friend".
A modal displays your score with a 30-second countdown, auto-sharing via WhatsApp.
Click "Share Now" to share instantly or "Cancel" to close.


Invite Others:

Share links (e.g., http://localhost:3000/invite/username).
Friends see your score and try to beat it.



Project Structure
globetrotter-challenge/
├── backend/
│   ├── index.js          # Express server
│   ├── cities.json       # City data
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── sounds/
│   │   │   └── wrong.mp3 # Buzzer for incorrect guesses
│   │   └── index.html
│   ├── src/
│   │   ├── components/   # React components (Game, Feedback, ShareModal, etc.)
│   │   ├── utils/        # Decryption helper
│   │   ├── App.js
│   │   ├── App.css
│   │   └── other CSS files
│   └── package.json
└── README.md

Notes

Security: API payloads are encrypted to hide sensitive data (e.g., correct city).
Audio: Buzzer sound plays only after user interaction (guess submission) to comply with browser policies.
Assets: Ensure wrong.mp3 is valid MP3 format and accessible at /sounds/wrong.mp3.

Future Enhancements

Add sound for correct guesses (e.g., correct.mp3).
Include dynamic images in share modal using OpenAI DALL·E.
Use MongoDB for persistent scores.
Add sound toggle for accessibility.

Troubleshooting

No Sound:
Verify wrong.mp3 is in frontend/public/sounds/.
Check console for errors (e.g., file not found).


API Errors:
Ensure backend runs on http://localhost:5000.
Confirm cities.json exists.
