const express = require('express');
const session = require('express-session');
const config = require('../../../data/config.js');

const app = express();
const port = config.server.port;

app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Define a virtual path for your API endpoints
const apiPath = '/api';
const apiRouter = express.Router();

// API endpoint to initiate Twitter authentication
apiRouter.get('/initiate-authentication/', async (req, res) => {
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

// Mount the API router at the virtual path
app.use(apiPath, apiRouter);

function generateCodeVerifier() {
    return base64URLEncode(require('crypto').randomBytes(32));
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
    return require('crypto').createHash('sha256').update(buffer).digest();
  }