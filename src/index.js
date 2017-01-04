// Backend (Express Server) part
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { supabase } = require('./supabaseClient');
const contractsRouter = require('./routes/contracts');
const usersRouter = require('./routes/users');
const sequelize = require('./database');
const Listing = require('./models/listing');
const User = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/contracts', contractsRouter);
app.use('/users', usersRouter);

// Example endpoint to get contracts
app.get('/contracts', async (req, res) => {
    if (!sequelize) {
        return res.status(500).json({ error: 'Sequelize not initialized. Please check your credentials.' });
    }
    try {
        const data = await sequelize.models.Contract.findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Frontend (React) part
import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import App from './App';
import './index.css';

if (typeof window !== 'undefined') {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}

export default function render(url, serverContext) {
  // TODO: Use ServerRouter from react-router
  console.log(`src/index.js: render() url: ${url}, serverContext: ${serverContext}`);
  return renderToString(<App />);
}
