const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// Get all listings
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.findAll();
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new listing
router.post('/', async (req, res) => {
    try {
        const newListing = await Listing.create(req.body);
        res.json(newListing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a listing
router.put('/:id', async (req, res) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        Object.assign(listing, req.body);
        await listing.save();
        res.json(listing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a listing
router.delete('/:id', async (req, res) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        await listing.destroy();
        res.json({ message: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
// In src/routes/contracts.js

// Get filtered listings
router.get('/search', async (req, res) => {
    const { availability, price, category, title } = req.query;
    try {
        const filters = {};
        if (availability) filters.availability = availability;
        if (price) filters.price = price;
        if (category) filters.category = category;
        if (title) filters.title = { [Sequelize.Op.like]: `%${title}%` };
        
        const listings = await Listing.findAll({ where: filters });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
