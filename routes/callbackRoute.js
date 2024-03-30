const express = require('express');
const axios = require('axios');
const { generateRandomString, sendAuthorizationDataToBot } = require('../utils');

const callbackRouter = express.Router();

callbackRouter.get('/', async (req, res) => {
  const { code, state } = req.query;
  const codeVerifier = req.session.codeVerifier;

  // Now you can send the authorization code and code verifier to the bot
  sendAuthorizationDataToBot({ code, codeVerifier, state });

  // Redirect to a success page or handle the response as needed
  res.redirect('/success');
});

module.exports = callbackRouter;
