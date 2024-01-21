const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises; // Import the 'fs' module for file operations
const config = require('./data/config.js');

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

app.get([ '/initiate-authentication/'], async (req, res) => {
  try {
    // Generate a random code verifier and calculate the code challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = base64URLEncode(sha256(codeVerifier));

    // Save the code verifier in the session (for later use during token exchange)
    req.session.codeVerifier = codeVerifier;

    // Generate the Twitter authentication URL
    const twitterAuthUrl = `https://api.twitter.com/oauth/authenticate?client_id=${twitterApiKey}&redirect_uri=https://authenthicatebot.azurewebsites.net/callback&response_type=code&scope=read&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    // Define the path to the JSON file
    const jsonFilePath = path.join(__dirname, 'data', 'twitterAuthUrl.json');

    // Modify the JSON file without sending a response
    await modifyJsonFile(jsonFilePath, twitterAuthUrl);

    // Send a success response without any content
    res.setHeader('Cache-Control', 'no-store');
    res.status(204).send();

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

async function modifyJsonFile(jsonFilePath, twitterAuthUrl) {
  try {
    const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
    const parsedData = JSON.parse(jsonData);
    parsedData.twitterAuthUrl = twitterAuthUrl;
    await fs.writeFile(jsonFilePath, JSON.stringify(parsedData, null, 2));
    console.log('JSON file modified successfully!');
  } catch (error) {
    throw new Error(`Failed to modify JSON file: ${error.message}`);
  }
}

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  // Store the authorization code globally
  authorizationCode = code;

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
