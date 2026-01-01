UrbanZest Restaurant - Full Stack Food Ordering App


A modern, responsive restaurant food ordering application built with React, Bootstrap, and JSON Server.

urbanzest.netlify.app
https://urbanzest-server-2.onrender.com



✨ Features
User Authentication - Sign up, Login, and Profile Management

Menu Browsing - 32+ gourmet dishes with pagination

Shopping Cart - Add/remove items, update quantities

Order Management - Track orders with real-time status

Payment Integration - Multiple payment methods

Responsive Design - Works on mobile, tablet, and desktop

Admin Dashboard - Manage orders and menu items


🛠️ Tech Stack
Frontend:

React 18

React Router DOM

Bootstrap 5

Font Awesome Icons

Axios for API calls

Vite as build tool

Backend:

JSON Server (REST API)

Node.js

Deployment:

Netlify (Frontend)

Railway (Backend - Optional)

📁 Project Structure
text
urbanzest-restaurant/
├── public/
│   ├── index.html
│   └── _redirects          # Netlify redirects for SPA
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Menu.jsx
│   │   ├── Cart.js
│   │   ├── Profile.js
│   │   ├── Orders.js
│   │   ├── PaymentPage.jsx
│   │   ├── TrackOrder.jsx
│   │   ├── Preloader.jsx
│   │   └── Preloader.css
│   ├── App.jsx
│   ├── main.jsx
│   └── App.css
├── server/
│   ├── db.json            # JSON database
│   └── package.json       # JSON Server config
├── vite.config.js
├── netlify.toml          # Netlify config
└── package.json
🚀 Quick Start
Prerequisites
Node.js 16+ and npm

Git

Installation
Clone the repository

bash
git clone https://github.com/your-username/urbanzest-restaurant.git
cd urbanzest-restaurant
Install dependencies

bash
npm install
Start the development server

bash
# Terminal 1: Start React frontend
npm run dev

# Terminal 2: Start JSON Server backend
cd server
npm install
npm start
Open your browser

Frontend: http://localhost:3000

Backend API: http://localhost:3001

🔧 Configuration
Environment Variables
Create .env file in root:

env
VITE_API_BASE=http://localhost:3001
Update in Components
javascript
// In all components, update API_BASE:
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
🌐 Deployment
Option 1: Netlify (Frontend Only - Quick)
Build your project:

bash
npm run build
Deploy to Netlify:

Go to Netlify

Drag & drop the dist folder

OR connect your GitHub repository

Configure Netlify:

Build command: npm run build

Publish directory: dist

Add environment variable: NODE_VERSION = 18






