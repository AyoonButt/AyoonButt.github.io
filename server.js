const express = require('express');
const session = require('express-session');
const initiateAuthRouter = require('./routes/initiateAuthRoute.js');
const callbackRouter = require('./routes/callbackRoute.js');
const config = require('./data/config.js');
const {generateRandomString} = require('./utils.js');
const port = config.server.port;

const app = express();

app.use(express.static('public')); // Serves static files from 'public' directory

const secretKey = generateRandomString(32);

// Session middleware
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true
}));

// Use routers for specific routes
app.use('/initiate-authentication', initiateAuthRouter);
app.use('/callback', callbackRouter);

app.listen(port, () => {
  console.log(`Server is running at https://authenthicatebot.azurewebsites.net/`);
});

module.exports = app;