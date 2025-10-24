const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

class GoogleAnalyticsService {
  constructor() {
    this.analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    this.propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  }

  async getRealtimeUsers() {
    try {
      const [response] = await this.analyticsDataClient.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        metrics: [{ name: 'activeUsers' }]
      });
      return { value: response.rows?.[0]?.metricValues?.[0]?.value || '0', success: true };
    } catch (error) {
      return { value: '0', success: false, error: error.message };
    }
  }

  async getOrganicTraffic(startDate = '7daysAgo', endDate = 'today') {
    try {
      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'engagementRate' }],
        dimensionFilter: {
          filter: { fieldName: 'sessionMedium', stringFilter: { value: 'organic' } }
        }
      });
      return { data: this.formatAnalyticsData(response), success: true };
    } catch (error) {
      return { data: [], success: false, error: error.message };
    }
  }

  async getTopPages(limit = 10) {
    try {
      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pageTitle' }, { name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
        limit: limit.toString()
      });
      return { 
        data: response.rows ? response.rows.map(row => ({
          title: row.dimensionValues[0].value,
          path: row.dimensionValues[1].value,
          pageViews: row.metricValues[0].value,
          avgDuration: row.metricValues[1].value
        })) : [], 
        success: true 
      };
    } catch (error) {
      return { data: [], success: false, error: error.message };
    }
  }

  async getTrafficSources() {
    try {
      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionMedium' }],
        metrics: [{ name: 'sessions' }],
        limit: '10'
      });
      return { 
        data: response.rows ? response.rows.map(row => ({
          medium: row.dimensionValues[0].value,
          sessions: row.metricValues[0].value
        })) : [], 
        success: true 
      };
    } catch (error) {
      return { data: [], success: false, error: error.message };
    }
  }

  async getPerformanceMetrics() {
    try {
      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'sessions' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }]
      });
      return { data: response.rows?.[0]?.metricValues || [], success: true };
    } catch (error) {
      return { data: [], success: false, error: error.message };
    }
  }

  formatAnalyticsData(response) {
    if (!response.rows) return [];
    return response.rows.map(row => ({
      date: row.dimensionValues[0].value,
      sessions: row.metricValues[0].value,
      engagedSessions: row.metricValues[1].value,
      engagementRate: row.metricValues[2].value
    }));
  }

  async testConnection() {
    try {
      await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        metrics: [{ name: 'sessions' }]
      });
      return { success: true, message: '✅ Successfully connected to Google Analytics' };
    } catch (error) {
      return { success: false, message: `❌ Connection failed: ${error.message}` };
    }
  }
}

module.exports = new GoogleAnalyticsService();