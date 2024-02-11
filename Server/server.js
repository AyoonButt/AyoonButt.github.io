const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const twitterAuthUrl = require('../data/link.js');
const config = require('../data/config.js'); // Import the configuration

const app = express();
const staticAssetsPath = path.join(__dirname, 'public'); // Adjust based on your directory structure

// Serve static files using Express middleware
app.use(express.static(staticAssetsPath));

const port = config.server.port;

app.use(express.json());


// Custom middleware for authentication
const authenticateUser = (req, res, next) => {
  // Implement your authentication logic here
  // Example: Check if the user is logged in based on session or tokens
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route handler
  } else {
    return res.status(401).json({ error: 'Unauthorized' }); // User is not authenticated
  }
};

// Custom middleware for authorization
const authorizeUser = (req, res, next) => {
  // Implement your authorization logic here
  // Example: Check if the user has the necessary role or permission
  if (req.user && req.user.role === 'admin') {
    return next(); // User is authorized, proceed to the next middleware or route handler
  } else {
    return res.status(403).json({ error: 'Forbidden' }); // User does not have the required permission
  }
};

// API endpoint to retrieve the desired URL
app.get('/initiate-authentication/', authenticateUser, authorizeUser, async (req, res) => {
  try {
    // Use the loaded desired link
    const desiredURL = twitterAuthUrl;

    // Return the URL as a response
    res.json({ url: desiredURL });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Callback route for handling Twitter callback
app.get('/callback', authenticateUser, authorizeUser, async (req, res) => {
  const { code, state } = req.query;

  // Retrieve the code verifier from the session
  const codeVerifier = req.session.codeVerifier;

  // Now you can send the authorization code and code verifier to the bot
  sendAuthorizationDataToBot({ code, codeVerifier, state });
});

// Function to send authorization data to the bot server
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

app.listen(port, () => {
  console.log(`Server is running at https://authenthicatebot.azurewebsites.net/`);
});
