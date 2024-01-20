const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const config = require('./data/config.js');

const port = config.server.port;

// Access your Twitter API keys
const twitterApiKey = config.twitterApi.apiKey;

// Utility functions (replace with your actual implementations)
function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return require('crypto').createHash('sha256').update(buffer).digest();
}

<<<<<<< HEAD
<<<<<<< HEAD
function generateCodeVerifier() {
  return base64URLEncode(require('crypto').randomBytes(32));
}

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

// Initiate authentication route
async function initiateAuthentication(req, res) {
=======
app.get([  '/initiate-authentication','/initiate-authentication/'], async (req, res) => {
>>>>>>> parent of fce4082 (readability)
=======
app.get([  '/initiate-authentication','/initiate-authentication/'], async (req, res) => {
>>>>>>> parent of fce4082 (readability)
  try {
    // Generate a random code verifier and calculate the code challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = base64URLEncode(sha256(codeVerifier));

    // Generate the Twitter authentication URL
    const twitterAuthUrl = `https://api.twitter.com/oauth/authenticate?client_id=${twitterApiKey}&redirect_uri=https://authenthicatebot.azurewebsites.net/callback&response_type=code&scope=read&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    // Define the path to the JSON file
    const jsonFilePath = path.join(__dirname, 'data', 'twitterAuthUrl.json');

    // Modify the JSON file without sending a response
    await modifyJsonFile(jsonFilePath, twitterAuthUrl);

    // Send a success response without any content
    res.status(204).send();

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// Callback route
async function callback(req, res) {
  const { code } = req.query;

  // Example: Send the authorization code to the bot
  sendAuthorizationCodeToBot(code);

  // Respond to the client
  res.status(200).send('Callback Successful');
}

// Function to send authorization code to the bot
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

// Set up routes
const routes = [
  { path: ['/initiate-authentication', '/initiate-authentication/'], handler: initiateAuthentication },
  { path: '/callback', handler: callback }
];

// Start the server
routes.forEach(route => {
  const { path, handler } = route;
  app.get(path, handler);
});

console.log(`Server is running at https://authenthicatebot.azurewebsites.net/`);
