const express = require('express');
const session = require('express-session');
const initiateAuthRouter = require('./routes/initiateAuthRoute');
const callbackRouter = require('./routes/callbackRoute');
const config = require('./data/config.js');
const port = config.server.port;

const app = express();

app.use(express.static('public')); // Serves static files from 'public' directory

const secretKey = crypto.randomBytes(32).toString('hex');

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
