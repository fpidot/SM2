const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Example endpoint to get contracts
app.get('/contracts', async (req, res) => {
    try {
        const { data, error } = await supabase.from('contracts').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
