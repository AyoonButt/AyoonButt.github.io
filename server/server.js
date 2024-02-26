const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');


const app = express();

const staticAssetsPath = path.join(__dirname, '..', 'public');
app.use(express.static(staticAssetsPath));

const port = config.server.port;


// Route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Callback route for handling Twitter response
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const codeVerifier = req.session.codeVerifier;

  // Now you can send the authorization code and code verifier to the bot
  sendAuthorizationDataToBot({ code, codeVerifier, state });

  // Redirect to a success page or handle the response as needed
  res.redirect('/success');
});

function sendAuthorizationDataToBot({ code, codeVerifier, state }) {
  const botServerEndpoint = 'https://twitterbot-ayoonbutt.azurewebsites.net/authorize';

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
