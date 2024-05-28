// src/database.js

const { Sequelize } = require('sequelize');

// Initialize Sequelize with SQLite as the dialect
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',  // This specifies the file to use for the SQLite database
});

module.exports = sequelize;
