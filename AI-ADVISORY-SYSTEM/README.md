# HarvestIQ – AI-Powered Smart Agriculture Platform

HarvestIQ is a full-stack, production-ready agricultural assistant built to enhance crop yield, forecast weather advisories, diagnose leaf diseases using Gemini vision models, track mandi pricing trends, and provide guidance in 6 regional languages.

---

## 🌾 Core Features
1. **Secure Registration & Login**: JWT authentication with password hashing using bcrypt.
2. **Farmer Profiles**: Onboarding and updates for soil types, irrigation methods, and farming goals.
3. **AI Farmer Assistant**: Dynamic agricultural conversation logs with previous chat retrieval, deletion, copying, and sharing.
4. **Crop Disease Advisory**: Crop leaf scan diagnostics through Gemini Vision API with treatment plans.
5. **Smart Crop Recommendations**: Custom models projecting crop selection, yield, and profit.
6. **Weather Forecast**: Real-time forecasts and UV indexes with weather-aware AI tips.
7. **Advisory Panels**: Soil conditioning, water conservation, organic fertilizer guidelines, and pest management.
8. **Mandi Market Prices**: Pricing tables across regional mandis with historical Area charts.
9. **Government Schemes**: Database of subsidies, document criteria, and portal links.
10. **Knowledge Center**: Interactive educational articles on hydroponics, greenhouse, and smart farming.
11. **Admin Console**: Analytics graphs, farmer bases, articles/schemes CRUD, and global broadcasts.
12. **Multi-Language Support**: Complete interface translation in English, Tamil, Telugu, Malayalam, Kannada, and Hindi.
13. **Dual Theme**: Responsive layouts in light and dark modes.

---

## 🛠️ Technology Stack
- **Frontend**: React.js, Vite, TypeScript, Tailwind CSS v4, Axios, React Router, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js, Mongoose, MongoDB, JWT, bcryptjs, Multer, Google Gemini API, OpenWeather API

---

## 📁 Project Structure
- `backend/`: Node/Express server, database schemas, controllers, and upload static directories.
- `frontend/`: React + TypeScript source code, components, context, hook layers, and build configurations.
- `run.ps1`: Automated startup launcher for local Node.js environment.

---

## ⚙️ Setup & Configuration
1. Open the configuration file `backend/.env` and replace placeholders with active keys:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/harvestiq
   JWT_SECRET=harvestiq_super_secure_jwt_secret_key_2026
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
   ```
2. Make sure you have a running MongoDB instance locally (`mongodb://127.0.0.1:27017`), or update the `MONGODB_URI` string to point to MongoDB Atlas.

---

## 🚀 Running the Application
To start both the Express backend and Vite frontend concurrently:
1. Open a PowerShell terminal in this directory.
2. Execute the launcher script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\run.ps1
   ```
3. Open your browser and navigate to:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

*Default Admin Credentials:*
- **Email:** `admin@harvestiq.com`
- **Password:** `admin123`
