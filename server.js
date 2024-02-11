const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const config = require('./data/config.js');

const app = express();
const port = config.server.port;

app.use(express.json());

const twitterApiKey = config.twitterApi.apiKey;
const twitterApiSecret = config.twitterApi.apiSecret;

app.use(session({
  secret: twitterApiSecret,
  resave: true,
  saveUninitialized: true
}));

app.get('/initiate-authentication/', async (req, res) => {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    const state = generateRandomString(32); // Change the length as needed

    // Save the code verifier and state in the session
    req.session.codeVerifier = codeVerifier;
    req.session.state = state;

    const twitterAuthUrl = `https://api.twitter.com/oauth/authenticate?client_id=${twitterApiKey}&redirect_uri=https://authenthicatebot.azurewebsites.net/callback&response_type=code&scope=read&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

    // Redirect to the Twitter authorization URL
    console.log(twitterAuthUrl)
    res.redirect(twitterAuthUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


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
