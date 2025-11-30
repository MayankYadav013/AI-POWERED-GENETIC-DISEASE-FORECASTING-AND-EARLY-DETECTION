const express = require('express');
const axios = require('axios');

const auth = require('../middleware/auth');

const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001/predict';
const mlClient = axios.create({
    baseURL: ML_SERVICE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

router.post('/', auth, async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ msg: 'Prediction payload is required' });
    }

    try {
        const { data } = await mlClient.post('', req.body);
        return res.json(data);
    } catch (err) {
        console.error('ML service error:', err.message);
        const status = err.response?.status || 500;
        const message = err.response?.data?.error || 'Error communicating with ML Service';
        return res.status(status).json({ msg: message });
    }
});

module.exports = router;
