// Backend (Express Server) part
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { supabase } = require('./src/supabaseClient');
const contractsRouter = require('./src/routes/contracts');
const usersRouter = require('./src/routes/users');
const sequelize = require('./src/database');
const Listing = require('./src/models/listing');
const User = require('./src/models/user');

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
