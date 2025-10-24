const express = require('express');
const router = express.Router();
const analyticsService = require('../services/googleAnalytics');

router.get('/test', async (req, res) => {
  try {
    const result = await analyticsService.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: `Connection test failed: ${error.message}` });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const [realtimeUsers, organicTraffic, topPages, trafficSources, performanceMetrics] = await Promise.all([
      analyticsService.getRealtimeUsers(),
      analyticsService.getOrganicTraffic('7daysAgo', 'today'),
      analyticsService.getTopPages(10),
      analyticsService.getTrafficSources(),
      analyticsService.getPerformanceMetrics()
    ]);

    res.json({
      success: true,
      data: { realtimeUsers, organicTraffic, topPages, trafficSources, performanceMetrics },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch analytics data' });
  }
});

router.get('/organic-traffic', async (req, res) => {
  try {
    const { startDate = '30daysAgo', endDate = 'today' } = req.query;
    const result = await analyticsService.getOrganicTraffic(startDate, endDate);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch organic traffic data' });
  }
});

router.get('/top-pages', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const result = await analyticsService.getTopPages(parseInt(limit));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch top pages data' });
  }
});

module.exports = router;
// Root analytics endpoint
router.get('/', async (req, res) => {
    try {
        // Redirect to dashboard endpoint or return basic info
        res.json({ 
            message: 'SEO Analytics API is running',
            endpoints: {
                dashboard: '/api/analytics/dashboard',
                organicTraffic: '/api/analytics/organic-traffic',
                topPages: '/api/analytics/top-pages',
                test: '/api/analytics/test'
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'API error: ' + error.message 
        });
    }
});
