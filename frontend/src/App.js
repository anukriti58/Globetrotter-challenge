import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import Invite from './components/Invite';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/invite/:username" element={<Invite />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;