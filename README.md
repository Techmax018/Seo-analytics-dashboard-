SEO Analytics Dashboard 📊

A real-time SEO analytics dashboard that connects to Google Analytics 4 (GA4) to display website performance metrics with a beautiful, responsive interface.

![Dashboard Preview](https://img.shields.io/badge/Status-🚀_Live-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express.js](https://img.shields.io/badge/Express.js-4.18%2B-lightgrey)
![Google Analytics](https://img.shields.io/badge/Google%20Analytics-GA4-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Responsive](https://img.shields.io/badge/📱_Responsive-Yes-success)

## ✨ Features

- **📊 Real-time Analytics**: Live user tracking and session monitoring
- **🎨 Beautiful UI**: Modern, professional dashboard design
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **🔐 Secure Authentication**: Service account-based GA4 integration
- **⚡ Performance Metrics**: Sessions, bounce rate, average duration, and more
- **📈 Top Pages Analysis**: Discover your best-performing content
- **🔄 Live Updates**: Real-time data refresh with smooth animations
- **🌙 Mobile Sidebar**: Collapsible navigation for mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- A Google Analytics 4 (GA4) property
- Google Cloud Service Account credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Techmax018/Seo-analytics-dashboard-.git
   cd Seo-analytics-dashboard-
```

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the application
   ```bash
   npm start
   ```
3. Open your browser
   ```
   http://localhost:3000
   ```

🔧 Google Analytics Setup

1. Create GA4 Property

· Go to Google Analytics
· Create a new GA4 property for your website
· Copy your Measurement ID (starts with G-)

2. Set up Service Account

1. Visit Google Cloud Console
2. Create a new project or select existing
3. Enable Analytics Data API
4. Create a service account
5. Download JSON credentials file
6. Add service account email to your GA4 property with Viewer role

3. Connect Dashboard

1. Open http://localhost:3000
2. Enter your GA4 Property ID
3. Paste your service account JSON credentials
4. Click "Connect to Analytics"

📸 Dashboard Preview

Login Page

https://via.placeholder.com/800x400/4f46e5/ffffff?text=SEO+Analytics+Login+Page

Main Dashboard

https://via.placeholder.com/800x400/1e293b/ffffff?text=Real-time+Analytics+Dashboard
