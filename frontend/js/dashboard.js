// Main Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize utilities
    DashboardUtils.initialize();
    
    // Setup refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefresh);
    }

    // Load initial data if needed
    // refreshBtn.click(); // Uncomment to load data automatically on page load
});

async function handleRefresh() {
    const btn = document.getElementById('refreshBtn');
    const icon = btn.querySelector('i');
    
    // Add loading state
    btn.disabled = true;
    btn.classList.add('loading');
    icon.className = 'fas fa-spinner fa-spin';
    
    try {
        // Make REAL API call to your backend
        const data = await ApiService.fetchAnalyticsData();
        
        // Update metrics with REAL data from your backend
        ApiService.updateMetricsWithRealData(data);
        
        // Show success feedback
        DashboardUtils.showNotification('Data refreshed successfully!', 'success');
        
    } catch (error) {
        console.error('Refresh error:', error);
        DashboardUtils.showNotification('Failed to refresh data. Please check your connection and try again.', 'error');
    } finally {
        // Remove loading state
        btn.disabled = false;
        btn.classList.remove('loading');
        icon.className = 'fas fa-sync-alt';
    }
}
