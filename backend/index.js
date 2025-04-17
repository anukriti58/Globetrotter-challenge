const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const cities = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json')));
const SECRET_KEY = 'globetrotter-secret-2025-16bytes';
const scores = {};

const PORT = process.env.PORT || 5000;
//To Do: Move this to a database, add OAuth for mapping prev scores

const getRandom = (arr, n) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const encryptPayload = (data) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return {
    iv: iv.toString('base64'),
    encryptedData: encrypted
  };
};

app.get('/game', (req, res) => {
  const correctCity = getRandom(cities, 1)[0];
  const clues = getRandom(correctCity.clues, Math.random() > 0.5 ? 2 : 1);
  const otherCities = getRandom(
    cities.filter((c) => c.city !== correctCity.city),
    3
  );

  const options = getRandom(
    [
      correctCity.city,
      ...otherCities.map((c) => c.city)
    ],
    4
  );

  const payload = {
    clues,
    options,
    correct: correctCity.city
  };

  res.json(encryptPayload(payload));
});

// Handle guess
app.post('/get-facts', (req, res) => {
  const { isCorrect, city } = req.body;

  const cityData = cities.find((c) => c.city === city);

  if (!cityData) {
    return res.status(404).json(encryptPayload({ error: 'City not found' }));
  }

  const payload = {
    correct: isCorrect,
    message: isCorrect ? '🎉 Nailed it!' : `😢 Not quite! Correct answer is ${cityData.city}.`,
    fun_facts: cityData.fun_fact,
    trivia: cityData.trivia
  };

  res.json(encryptPayload(payload));
});

// Save score
app.post('/score', (req, res) => {
  const { username, score } = req.body;
  if (!username || !score) {
    return res.status(400).json(encryptPayload({ error: 'Missing username or score' }));
  }
  scores[username] = score;
  const payload = { success: true };
  res.json(encryptPayload(payload));
});

app.get('/score/:username', (req, res) => {
  const score = scores[req.params.username];
  if (!score) {
    return res.status(404).json(encryptPayload({ error: 'Score not found' }));
  }
  res.json(encryptPayload(score));
});

app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});

module.exports = app;