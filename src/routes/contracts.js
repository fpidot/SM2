const express = require('express');
const router = express.Router();
const sdk = require('../sharetribeClient');

// Get all listings from Sharetribe
router.get('/', async (req, res) => {
    try {
        const response = await sdk.listings.query();
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get filtered listings from Sharetribe
router.get('/filter', async (req, res) => {
    const { category, priceRange } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (priceRange) filters.priceRange = priceRange;

    try {
        const response = await sdk.listings.query({ filters });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new listing in Sharetribe
router.post('/', async (req, res) => {
    try {
        const newListing = await sdk.listings.create(req.body);
        res.json(newListing.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a listing in Sharetribe
router.put('/:id', async (req, res) => {
    try {
        const listingId = req.params.id;
        const updatedListing = await sdk.listings.update({
            id: listingId,
            ...req.body
        });
        res.json(updatedListing.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a listing in Sharetribe
router.delete('/:id', async (req, res) => {
    try {
        const listingId = req.params.id;
        await sdk.listings.delete(listingId);
        res.json({ message: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
