const express = require('express');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const config = require('../../data/config.js');

const app = express();

const staticAssetsPath = path.join(__dirname, '..', 'public');
app.use(express.static(staticAssetsPath));

const port = config.server.port;

app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

const apiRouter = express.Router();

// API endpoint to initiate Twitter authentication
apiRouter.post('/initiate-authentication/', async (req, res) => {
  try {
    const { codeVerifier, codeChallenge, state } = generateAuthenticationParams();

    req.session.codeVerifier = codeVerifier;
    req.session.state = state;

    const twitterAuthUrl = `https://api.twitter.com/oauth/authenticate?client_id=${config.twitterApi.apiKey}&redirect_uri=https://authenthicatebot.azurewebsites.net/callback&response_type=code&scope=read&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

    res.json({ redirectUrl: twitterAuthUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mount the API router at the virtual path
app.use('/api', apiRouter);

function generateAuthenticationParams() {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(codeVerifier));
  const state = generateRandomString(32);

  return { codeVerifier, codeChallenge, state };
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});