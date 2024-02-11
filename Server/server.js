const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const config = require('../data/config.js');

const app = express();
const staticAssetsPath = path.join(__dirname, 'public'); // Adjust based on your directory structure

// Serve static files using Express middleware
app.use(express.static(staticAssetsPath));

const port = config.server.port;

app.use(express.json());

app.get('/initiate-authentication/', twitterRedirectMiddleware);


const twitterApiKey = config.twitterApi.apiKey;
const twitterApiSecret = config.twitterApi.apiSecret;

app.use(session({
  secret: twitterApiSecret,
  resave: true,
  saveUninitialized: true
}));

// middleware for handling Twitter authentication redirects
const twitterRedirectMiddleware = async (req, res, next) => {
  try {
    /* Generate code verifier, code challenge, and state
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    const state = generateRandomString(32);

    // Save in session
    req.session.codeVerifier = codeVerifier;
    req.session.state = state;

    // Construct Twitter authorization URL */
    const twitterAuthUrl = `https://api.twitter.com/oauth/authenticate?client_id=${twitterApiKey}&redirect_uri=https://authenthicatebot.azurewebsites.net/callback&response_type=code&scope=read&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

    // Redirect to Twitter
    res.redirect(twitterAuthUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // Retrieve the code verifier from the session
  const codeVerifier = req.session.codeVerifier;

  // Now you can send the authorization code and code verifier to the bot
  sendAuthorizationDataToBot({ code, codeVerifier, state });
});

function sendAuthorizationDataToBot({ code, codeVerifier, state }) {
  const botServerEndpoint = 'https://twitterbot-ayoonbutt.azurewebsites.net/authorize';

  // Make a POST request to the bot server to send the authorization code and code verifier
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

function generateCodeVerifier() {
  return base64URLEncode(require('crypto').randomBytes(32));
}

app.listen(port, () => {
  console.log(`Server is running at https://authenthicatebot.azurewebsites.net/`);
});
