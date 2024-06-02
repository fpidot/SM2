const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { deserialize } = require('./api-util/sdk');
const supabase = require('../src/database');
const fetchUserData = require('./auth');
const { initiatePrivileged } = require('./controllers/privilegedController');
const initiateLoginAs = require('./api/initiate-login-as');
const loginAs = require('./api/login-as');
const transactionLineItems = require('./api/transaction-line-items');
const transitionPrivileged = require('./api/transition-privileged');
const createUserWithIdp = require('./api/auth/createUserWithIdp');
const { authenticateFacebook, authenticateFacebookCallback } = require('./api/auth/facebook');
const { authenticateGoogle, authenticateGoogleCallback } = require('./api/auth/google');

const router = express.Router();

// ================ API router middleware: ================ //

// Logging middleware
router.use(morgan('combined'));

// Parse Transit body first to a string
router.use(
  bodyParser.text({
    type: 'application/transit+json',
  })
);

// Deserialize Transit body string to JS data
router.use((req, res, next) => {
  if (req.get('Content-Type') === 'application/transit+json' && typeof req.body === 'string') {
    try {
      req.body = deserialize(req.body);
    } catch (e) {
      console.error('Failed to parse request body as Transit:');
      console.error(e);
      res.status(400).send('Invalid Transit in request body.');
      return;
    }
  }
  next();
});

router.use(bodyParser.json()); // Parse JSON body

// JWT authentication middleware
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied. No token provided.');
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
});

// Use the middleware to fetch user data
router.use(fetchUserData);

// Define the route and use the controller
router.post('/initiate-privileged', initiatePrivileged);

console.log('apiRouter loaded');

// ================ API router endpoints: ================ //

router.get('/initiate-login-as', initiateLoginAs);
router.get('/login-as', loginAs);
router.post('/transaction-line-items', transactionLineItems);
router.post('/transition-privileged', transitionPrivileged);
router.post('/auth/create-user-with-idp', createUserWithIdp);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Route to create a new user
router.post('/auth/create-user', async (req, res) => {
  try {
    const { username, email, password, balance = 0.0, supe_balance = 0.0 } = req.body;
    const { data, error } = await supabase.from('users').insert([{ username, email, password, balance, supe_balance }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to fetch a user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) return res.status(400).json({ error: 'User not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Simplified route to update the username field
router.put('/auth/user/:id/username', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const updateData = { username };
    const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select();
    if (error || !data || data.length === 0) return res.status(400).json({ error: 'Update failed' });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to increment/decrement the money field
router.put('/auth/user/:id/money', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const { data: existingUser, error: fetchError } = await supabase.from('users').select('money').eq('id', id).single();
    if (fetchError) return res.status(400).json({ error: 'User not found' });
    const currentMoney = parseFloat(existingUser.money);
    const newMoney = currentMoney + parseFloat(amount);
    const updateData = { money: newMoney };
    const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select();
    if (error || !data || data.length === 0) return res.status(400).json({ error: 'Update failed' });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/auth/receive-user-info', async (req, res) => {
  try {
    const users = req.body;
    const dataToUpsert = users.map(user => ({
      id: user.id,
      username: user.username || '',
      email: user.email || '',
      money: user.money || 0,
      marketsTraded: user.marketsTraded || [],
      moneyEarned: user.moneyEarned || 0,
      marketsCreated: user.marketsCreated || [],
      signalAccessPermission: user.signalAccessPermission || []
    }));
    const invalidUsers = dataToUpsert.filter(user => user.id == null);
    if (invalidUsers.length > 0) return res.status(400).json({ error: 'Users with null IDs found', invalidUsers });
    const { data, error } = await supabase.from('users').upsert(dataToUpsert, { onConflict: ['id'] }).select();
    if (error) throw new Error(error.message);
    const updatedUsers = await Promise.all(dataToUpsert.map(async (user) => {
      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (error) throw new Error(error.message);
      return data;
    }));
    res.status(200).json(updatedUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to fetch all contracts
router.get('/contracts', async (req, res) => {
  try {
    const { data, error } = await supabase.from('contracts').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/auth/facebook', authenticateFacebook);
router.get('/auth/facebook/callback', authenticateFacebookCallback);
router.get('/auth/google', authenticateGoogle);
router.get('/auth/google/callback', authenticateGoogleCallback);

router.get('/listings', (req, res) => {
  res.json({ message: 'List of listings' });
});

router.post('/listings', async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const { data, error } = await supabase.from('listings').insert([{ title, description, price }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
