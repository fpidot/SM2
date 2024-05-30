const dotenv = require('dotenv');
const path = require('path');

// Determine the correct environment file to load
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
const envPath = path.resolve(__dirname, envFile);

// Load environment variables from the determined file
dotenv.config({ path: envPath });

// Log loaded environment variables for debugging
console.log('Loaded environment variables from:', envFile);
console.log('PORT:', process.env.PORT);
console.log('REACT_APP_DEV_API_SERVER_PORT:', process.env.REACT_APP_DEV_API_SERVER_PORT);
console.log('REACT_APP_CANONICAL_ROOT_URL:', process.env.REACT_APP_CANONICAL_ROOT_URL);
