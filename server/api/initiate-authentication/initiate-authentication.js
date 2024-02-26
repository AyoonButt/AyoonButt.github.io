const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const directoryBrowserRouter = require('../../../data/directoryBrowser.js'); 
const config = require('../../../data/config.js');

const app = express();

const port = config.server.port;

app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

const apiRouter = express.Router();

app.use('/api', apiRouter);

// Include the directory browser router
app.use('/api', directoryBrowserRouter);

// API endpoint to initiate Twitter authentication
apiRouter.get('/initiate-authentication/', async (req, res) => {
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



function generateAuthenticationParams() {
  const codeVerifier = generateRandomString(32);
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
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(buffer).digest();
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
