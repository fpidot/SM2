const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Listing = sequelize.define('Listing', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    availability: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    creator: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    }
});

module.exports = Listing;
