// Configure process.env with .env.* files
require('./env');

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./apiRouter');
const wellKnownRouter = require('./wellKnownRouter');

const radix = 10;
const PORT = parseInt(process.env.REACT_APP_DEV_API_SERVER_PORT, radix) || 3501;
const app = express();

// Logging to verify environment variables
console.log('Starting API server...');
console.log('PORT:', PORT);
console.log('REACT_APP_CANONICAL_ROOT_URL:', process.env.REACT_APP_CANONICAL_ROOT_URL);

app.use(
  cors({
    origin: process.env.REACT_APP_CANONICAL_ROOT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use('/.well-known', wellKnownRouter);
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`API server listening on ${PORT}`);
});
