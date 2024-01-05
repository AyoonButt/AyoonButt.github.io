const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const config = require('./config.js');

const app = express();
const port = config.server.port;

// Access your Twitter API keys
const twitterApiKey = config.twitterApi.apiKey;
const twitterApiSecret = config.twitterApi.apiSecret;

// Set up middleware to parse JSON
app.use(express.json());

// Store the authorization code in a global variable
let authorizationCode;

// Set up a session
app.use(session({
  secret: twitterApiSecret,
  resave: true,
  saveUninitialized: true
}));

// Serve static files (including directory listings) from the wwwroot directory
const wwwrootPath = path.join(__dirname, 'wwwroot');
app.use(express.static(wwwrootPath, { extensions: ['html', 'htm'], redirect: false }));

// Serve index.html as the default document for specific URLs
const serveIndexHtml = (req, res) => {
  res.sendFile(path.join(wwwrootPath, 'index.html'));
};

// Define the endpoints
app.get('/', serveIndexHtml);
app.get('/initiate-authentication', serveIndexHtml);
app.get('/callback', serveIndexHtml);

// Endpoint to initiate Twitter authentication
app.get('/initiate-authentication', (req, res) => {
  // Generate a random code verifier and calculate the code challenge
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = base64URLEncode(sha256(codeVerifier));

  // Save the code verifier in the session (for later use during token exchange)
  req.session.codeVerifier = codeVerifier;

  // Redirect the user to Twitter for authentication
  res.redirect(`https://api.twitter.com/oauth/authenticate?client_id=${twitterApiKey}&redirect_uri=https://authenthicatebot.azurewebsites.net/callback&response_type=code&scope=read&code_challenge=${codeChallenge}&code_challenge_method=S256`);
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
  const botServerEndpoint = 'https://twitterbot-ayoonbutt.azurewebsites.net';

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

app.listen(port, () => {
  console.log(`Server is running at https://authenthicatebot.azurewebsites.net/`);
});
