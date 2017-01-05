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
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { BrowserRouter, ServerRouter } from 'react-router';
import Routes from './Routes';
import './index.css';

const ClientApp = () => (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
);

const ServerApp = (props) => {
  const { url, context } = props;
  return (
    <ServerRouter location={ url } context={ context } >
      <Routes />
    </ServerRouter>
  );
};

if (typeof window !== 'undefined') {
  ReactDOM.render(<ClientApp />, document.getElementById('root'));
}

const renderApp = (url, serverContext) => {
  const body = ReactDOMServer.renderToString(
    <ServerApp url={ url } context={ serverContext }/>
  );
  const head = Helmet.rewind();
  return { head, body };
};

export default renderApp;
