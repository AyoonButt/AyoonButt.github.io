const config = require('./config.js');

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

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const twitterApiKey = config.twitterApi.apiKey;

// Generate code verifier, code challenge, and state
const codeVerifier = generateCodeVerifier();
const codeChallenge = base64URLEncode(sha256(codeVerifier));
const state = generateRandomString(32);

// Construct Twitter authorization URL
const twitterAuthUrl = `https://api.twitter.com/oauth/authenticate?client_id=${twitterApiKey}&redirect_uri=https://authenthicatebot.azurewebsites.net/callback&response_type=code&scope=read&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

module.exports = twitterAuthUrl;

console.log('Twitter Authorization URL:', twitterAuthUrl);
