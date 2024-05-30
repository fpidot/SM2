require('./env').configureEnv();

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./apiRouter');
const wellKnownRouter = require('./wellKnownRouter');

const radix = 10;
const PORT = parseInt(process.env.REACT_APP_DEV_API_SERVER_PORT, radix) || 3501;

console.log('PORT:', PORT);
console.log('REACT_APP_CANONICAL_ROOT_URL:', process.env.REACT_APP_CANONICAL_ROOT_URL);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

const app = express();

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
