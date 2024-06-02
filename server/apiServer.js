require('./env').configureEnv();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./apiRouter');
const wellKnownRouter = require('./wellKnownRouter');

const radix = 10;
const PORT = parseInt(process.env.PORT, radix) || 3500;

console.log('Starting API server...');
console.log('PORT:', PORT);
console.log('REACT_APP_CANONICAL_ROOT_URL:', process.env.REACT_APP_CANONICAL_ROOT_URL);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);
console.log('REACT_APP_DEV_API_SERVER_PORT:', process.env.REACT_APP_DEV_API_SERVER_PORT);

const app = express();

app.use(
  cors({
    origin: process.env.REACT_APP_CANONICAL_ROOT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json()); // Added to parse JSON body

app.use('/.well-known', wellKnownRouter);
app.use('/api', apiRouter);

// Serve static files from the React app build directory
const staticFilesPath = path.join(__dirname, '../build');
app.use(express.static(staticFilesPath));

// Serve index.html for all other routes to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`API server listening on ${PORT}`);
});
