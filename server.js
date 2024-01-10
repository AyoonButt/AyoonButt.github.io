const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises; // Import the 'fs' module for file operations
const config = require('./config.js');

const app = express();
const port = config.server.port;

app.use(express.json());

// Access your Twitter API keys
const twitterApiKey = config.twitterApi.apiKey;
const twitterApiSecret = config.twitterApi.apiSecret;

// Store the authorization code in a global variable
let authorizationCode;

// Set up a session
app.use(session({
  secret: twitterApiSecret,
  resave: true,
  saveUninitialized: true
}));

// Change the response type to HTML
app.get(['/initiate-authentication', '/initiate-authentication/'], async (req, res) => {

   // Generate a random code verifier and calculate the code challenge
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = base64URLEncode(sha256(codeVerifier));

  // Save the code verifier in the session (for later use during token exchange)
  req.session.codeVerifier = codeVerifier;

  // Generate the Twitter authentication URL
  const data = { twitterAuthUrl };
  try {
    await fs.writeFile('twitterAuthUrl.json', JSON.stringify(data));
    // Send a simple HTML response
    res.send('<h1>Twitter Auth URL generated and saved.</h1>');
  } catch (error) {
    console.error('Error saving Twitter Auth URL:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  const { codeVerifier } = req.session;

  // Store the authorization code globally
  authorizationCode = code;

  // Render a simple HTML response
  res.send('<h1>Authorization code received. You can close this window/tab.</h1>');

  // Now you can send the authorization code to the bot (you need to implement this part)
  sendAuthorizationCodeToBot(authorizationCode);
});

function sendAuthorizationCodeToBot(code) {
  // Replace 'http://bot-server/authorize' with the actual endpoint of your bot server
  const botServerEndpoint = 'https://twitterbot-ayoonbutt.azurewebsites.net/authorize';

  // Make a POST request to the bot server to send the authorization code
  axios.post(botServerEndpoint, { code })
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
