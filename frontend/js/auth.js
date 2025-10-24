class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        document.getElementById('connectBtn').addEventListener('click', () => this.connectToAnalytics());
    }

    async connectToAnalytics() {
        const propertyId = document.getElementById('propertyId').value.trim();
        
        if (!propertyId) {
            alert('Please enter Google Analytics Property ID');
            return;
        }

        try {
            const response = await fetch('/api/analytics/test');
            const result = await response.json();

            if (result.success) {
                localStorage.setItem('gaConfig', JSON.stringify({ propertyId }));
                window.location.href = '/dashboard';
            } else {
                alert('Connection failed: ' + result.message);
            }
        } catch (error) {
            alert('Connection error: ' + error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});