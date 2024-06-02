const jwt = require('jsonwebtoken');

const secretKey = 'MA!BzjF?<=U~G12'; // Replace this with your actual secret key

const token = jwt.sign({ user: 'exampleUser' }, secretKey, { expiresIn: '1h' });

console.log('Generated JWT:', token);
