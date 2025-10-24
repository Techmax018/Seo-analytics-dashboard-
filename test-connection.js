const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔧 Testing Google Analytics Connection...');
    console.log('Property ID:', process.env.GOOGLE_ANALYTICS_PROPERTY_ID);
    console.log('Service Account:', process.env.GOOGLE_CLIENT_EMAIL);
    
    const analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'sessions' }]
    });
    
    const sessions = response.rows?.[0]?.metricValues?.[0]?.value || '0';
    console.log('✅ SUCCESS! Connected to Google Analytics');
    console.log('Sessions (last 7 days):', sessions);
    
    if (sessions === '0') {
      console.log('📝 Note: No sessions recorded yet. This is normal for new properties.');
      console.log('   Your dashboard will work once you have website traffic.');
    }
    
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Did you add the service account email to GA4?');
    console.log('2. Is Analytics Data API enabled?');
    console.log('3. Check if Property ID is correct');
  }
}

testConnection();
