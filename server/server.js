const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const config = require('../data/config.js');

const app = express();

const staticAssetsPath = path.join(__dirname, '..', 'public');
app.use(express.static(staticAssetsPath));

const port = config.server.port;

app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// API endpoint to initiate Twitter authentication
app.post('/initiate-authentication/', async (req, res) => {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    const state = generateRandomString(32);

    req.session.codeVerifier = codeVerifier;
    req.session.state = state;

    const twitterAuthUrl = `https://api.twitter.com/oauth/authenticate?client_id=${config.twitterApi.apiKey}&redirect_uri=https://authenthicatebot.azurewebsites.net/callback&response_type=code&scope=read&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

    res.json({ redirectUrl: twitterAuthUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Callback route for handling Twitter response
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const codeVerifier = req.session.codeVerifier;

  // Now you can send the authorization code and code verifier to the bot
  sendAuthorizationDataToBot({ code, codeVerifier, state });

  // Redirect to a success page or handle the response as needed
  res.redirect('/success');
});

function sendAuthorizationDataToBot({ code, codeVerifier, state }) {
  const botServerEndpoint = 'https://twitterbot-ayoonbutt.azurewebsites.net/authorize';

  axios.post(botServerEndpoint, { code, codeVerifier, state })
    .then(response => {
      console.log(response.data);
      // Handle success if needed
    })
    .catch(error => {
      console.error(error);
      // Handle error if needed
    });
}

function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return require('crypto').createHash('sha256').update(buffer).digest();
}

app.listen(port, () => {
  console.log(`Server is running at https://authenthicatebot.azurewebsites.net/`);
});
