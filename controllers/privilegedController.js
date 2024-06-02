// controllers/privilegedController.js

const { initiatePrivilegedTransaction } = require('../services/privilegedService');

const initiatePrivileged = async (req, res) => {
  try {
    const result = await initiatePrivilegedTransaction(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in initiatePrivileged controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  initiatePrivileged,
};
