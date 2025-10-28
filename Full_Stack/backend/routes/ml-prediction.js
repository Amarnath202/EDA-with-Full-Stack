const express = require('express');
const router = express.Router();
const axios = require('axios');

// ML Model Server URL (from Dashboard_site/models/server.py)
const ML_SERVER_URL = 'http://localhost:5001/predict';

/**
 * @route   POST /api/ml/predict
 * @desc    Predict crop prices using ML model
 * @access  Public
 */
router.post('/predict', async (req, res) => {
    try {
        const { state, district, season, crop, production, zn, fe } = req.body;

        // Validate required fields
        if (!state || !district || !season || !crop || production === undefined || zn === undefined || fe === undefined) {
            return res.status(400).json({
                error: 'All fields are required: state, district, season, crop, production, zn, fe'
            });
        }

        // Forward request to ML server
        const mlResponse = await axios.post(ML_SERVER_URL, {
            state: state.trim(),
            district: district.trim(),
            season: season.trim(),
            crop: crop.trim(),
            production: parseFloat(production),
            zn: parseFloat(zn),
            fe: parseFloat(fe)
        });

        // Return prediction results
        res.json(mlResponse.data);

    } catch (error) {
        console.error('ML Prediction Error:', error.message);

        // Check if error is from ML server
        if (error.response) {
            return res.status(error.response.status).json({
                error: error.response.data.error || 'ML prediction failed'
            });
        }

        // Connection error to ML server
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'ML prediction service is not available. Please ensure the ML server is running on port 5001.'
            });
        }

        // Generic error
        res.status(500).json({
            error: 'An error occurred while processing the prediction request'
        });
    }
});

/**
 * @route   GET /api/ml/health
 * @desc    Check ML service health
 * @access  Public
 */
router.get('/health', async (req, res) => {
    try {
        // Try to connect to ML server
        await axios.get('http://localhost:5001/');
        res.json({
            status: 'healthy',
            message: 'ML service is running'
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            message: 'ML service is not available'
        });
    }
});

module.exports = router;
