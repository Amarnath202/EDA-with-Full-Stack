const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Configuration for Power BI
const powerbiConfig = {
    // These values should be stored in environment variables
    clientId: process.env.POWERBI_CLIENT_ID,
    clientSecret: process.env.POWERBI_CLIENT_SECRET,
    tenantId: process.env.POWERBI_TENANT_ID,
    workspaceId: process.env.POWERBI_WORKSPACE_ID,
    reports: {
        overallDashboard: {
            reportId: process.env.POWERBI_OVERALL_REPORT_ID,
            groupId: process.env.POWERBI_GROUP_ID
        }
        // Add other report configurations as needed
    }
};

// Get Power BI embed info
router.get('/embedinfo', async (req, res) => {
    try {
        // This is a placeholder. In production, you should:
        // 1. Validate user permissions
        // 2. Generate a proper embed token using Power BI REST APIs
        // 3. Return proper report configurations
        
        const embedInfo = {
            accessToken: "YOUR_POWERBI_ACCESS_TOKEN", // Generate this using Power BI REST APIs
            reports: powerbiConfig.reports
        };

        res.json(embedInfo);
    } catch (error) {
        console.error('Power BI embed error:', error);
        res.status(500).json({ error: 'Failed to get Power BI embed info' });
    }
});

module.exports = router;