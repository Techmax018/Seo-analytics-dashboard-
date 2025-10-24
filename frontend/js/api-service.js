// API Service for Dashboard
class ApiService {
    static async fetchAnalyticsData() {
        try {
            console.log('🔄 Fetching analytics data from /api/analytics/dashboard');
            const response = await fetch('/api/analytics/dashboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📊 API Response:', data);
            
            // Check if the API returned success
            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch analytics data');
            }
            
            return data.data;
        } catch (error) {
            console.error('❌ API fetch error:', error);
            
            // If it's a connection error, provide more specific message
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to server. Please make sure the backend is running on port 3000.');
            }
            
            throw error;
        }
    }

    static formatDuration(seconds) {
        console.log('Formatting duration:', seconds);
        if (typeof seconds !== 'number' || isNaN(seconds) || seconds === 0) return '0s';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        if (mins === 0) return `${secs}s`;
        return `${mins}m ${secs}s`;
    }

    static safeParseNumber(value, defaultValue = 0) {
        if (value === null || value === undefined || value === '') return defaultValue;
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : num;
    }

    static getCurrentValue(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return 0;
        
        const text = element.textContent;
        console.log(`Current value for ${elementId}:`, text);
        
        // Extract numbers from text (remove non-numeric characters except decimal point)
        const numericText = text.replace(/[^0-9.]/g, '');
        const value = parseFloat(numericText) || 0;
        console.log(`Parsed value for ${elementId}:`, value);
        
        return value;
    }

    static animateValue(elementId, start, end, duration, isPercentage = false) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element not found: ${elementId}`);
            return;
        }

        const startValue = this.safeParseNumber(start);
        const endValue = this.safeParseNumber(end);
        
        console.log(`Animating ${elementId}: ${startValue} -> ${endValue}`);
        
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentValue = startValue + (endValue - startValue) * easeOutQuart;
            
            // Update element based on type
            if (isPercentage) {
                element.textContent = currentValue.toFixed(1) + '%';
            } else if (elementId === 'avgDuration') {
                // Skip animation for duration - we handle it separately
                return;
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    static updateTableWithRealData(pages) {
        const tableBody = document.getElementById('pagesTableBody');
        if (!tableBody) return;

        console.log('Updating table with pages:', pages);
        tableBody.innerHTML = '';
        
        if (!pages || pages.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #64748b; padding: 2rem;">
                        <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                        No page data available. Connect to Google Analytics first.
                    </td>
                </tr>
            `;
            return;
        }
        
        pages.forEach(page => {
            const row = document.createElement('tr');
            const sessions = this.safeParseNumber(page.sessions || page.visits);
            const duration = this.safeParseNumber(page.avgSessionDuration || page.duration);
            const bounceRate = this.safeParseNumber(page.bounceRate);
            
            row.innerHTML = `
                <td>${page.pageTitle || page.url || page.hostname || 'N/A'}</td>
                <td>${sessions.toLocaleString()}</td>
                <td>${this.formatDuration(duration)}</td>
                <td>${bounceRate ? bounceRate.toFixed(1) + '%' : 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    static updateMetricsWithRealData(data) {
        console.log('🎯 Updating metrics with data:', data);
        
        // Get current values safely
        const currentRealTimeUsers = this.getCurrentValue('realTimeUsers');
        const currentTotalSessions = this.getCurrentValue('totalSessions');
        const currentBounceRate = this.getCurrentValue('bounceRate');

        // Update real-time users
        if (data.realtimeUsers !== undefined && data.realtimeUsers !== null) {
            const realTimeUsers = this.safeParseNumber(data.realtimeUsers);
            console.log('Real-time users:', realTimeUsers);
            this.animateValue('realTimeUsers', currentRealTimeUsers, realTimeUsers, 1000);
        } else {
            console.warn('No realtimeUsers data found');
            document.getElementById('realTimeUsers').textContent = '0';
        }
        
        // Update total sessions (use organic traffic data)
        if (data.organicTraffic && data.organicTraffic.sessions !== undefined) {
            const totalSessions = this.safeParseNumber(data.organicTraffic.sessions);
            console.log('Total sessions:', totalSessions);
            this.animateValue('totalSessions', currentTotalSessions, totalSessions, 1000);
        } else if (data.performanceMetrics && data.performanceMetrics.sessions !== undefined) {
            const totalSessions = this.safeParseNumber(data.performanceMetrics.sessions);
            console.log('Total sessions (from performance):', totalSessions);
            this.animateValue('totalSessions', currentTotalSessions, totalSessions, 1000);
        } else {
            console.warn('No sessions data found');
            document.getElementById('totalSessions').textContent = '0';
        }
        
        // Update average duration
        if (data.performanceMetrics && data.performanceMetrics.avgSessionDuration !== undefined) {
            const avgDuration = this.safeParseNumber(data.performanceMetrics.avgSessionDuration);
            console.log('Average duration:', avgDuration);
            document.getElementById('avgDuration').textContent = this.formatDuration(avgDuration);
        } else {
            console.warn('No avgSessionDuration data found');
            document.getElementById('avgDuration').textContent = '0s';
        }
        
        // Update bounce rate
        if (data.performanceMetrics && data.performanceMetrics.bounceRate !== undefined) {
            const bounceRate = this.safeParseNumber(data.performanceMetrics.bounceRate);
            console.log('Bounce rate:', bounceRate);
            this.animateValue('bounceRate', currentBounceRate, bounceRate, 1000, true);
        } else {
            console.warn('No bounceRate data found');
            document.getElementById('bounceRate').textContent = '0%';
        }
        
        // Update top pages table
        if (data.topPages && Array.isArray(data.topPages)) {
            this.updateTableWithRealData(data.topPages);
        } else {
            console.warn('No topPages data found');
        }
    }
}
