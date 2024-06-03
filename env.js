const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const configureEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = path.resolve(__dirname, `../.env.${nodeEnv}`);

  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    dotenv.config();
  }

  // Check if the canonical root URL is defined, else set a default value.
  if (!process.env.REACT_APP_CANONICAL_ROOT_URL) {
    process.env.REACT_APP_CANONICAL_ROOT_URL = 'http://localhost:3501'; // Set to frontend port
  }

  // Set default ports if not defined
  process.env.REACT_APP_DEV_API_SERVER_PORT = process.env.REACT_APP_DEV_API_SERVER_PORT || 3501;
  process.env.PORT = process.env.PORT || 3500;

  console.log('Loaded environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('REACT_APP_DEV_API_SERVER_PORT:', process.env.REACT_APP_DEV_API_SERVER_PORT);
  console.log('PORT:', process.env.PORT);
  console.log('REACT_APP_CANONICAL_ROOT_URL:', process.env.REACT_APP_CANONICAL_ROOT_URL);

  // Verify required environment variables
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'REACT_APP_DEV_API_SERVER_PORT',
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is required but not defined.`);
    }
  });
};

module.exports = { configureEnv };
