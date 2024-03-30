
const express = require('express');
const { generateCodeVerifier, base64URLEncode, sha256, sendAuthorizationDataToBot } = require('../utils');
const config = require('../data/config.js'); // Importing from config.js

const initiateAuthRouter = express.Router();

initiateAuthRouter.get('/', async (req, res) => {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    const state = generateRandomString(32);

    req.session.codeVerifier = codeVerifier;
    req.session.state = state;

    const twitterAuthUrl = `https://api.twitter.com/oauth/authenticate?client_id=${config.twitterApi.apiKey}&redirect_uri=https://authenthicatebot.azurewebsites.net/callback&response_type=code&scope=read&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

    // Redirect the browser to Twitter's authorization page
    res.redirect(302, twitterAuthUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = initiateAuthRouter;
