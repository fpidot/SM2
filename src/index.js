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

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
