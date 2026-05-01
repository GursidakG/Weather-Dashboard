# Weather Dashboard

A polished React weather dashboard with live city search, current conditions, a 5-day forecast, and a 24-hour temperature chart powered by Open-Meteo.

## Live Demo

https://weather-dashboard-two-rho.vercel.app

## Screenshot

<img width="1223" height="659" alt="Screenshot 2026-05-01 at 2 12 02 AM" src="https://github.com/user-attachments/assets/9b02f5d4-e617-42a0-80a1-f127de15ff22" />

## Tech Stack

- React + Vite
- CSS variables and custom responsive CSS
- Recharts
- Lucide React icons
- Open-Meteo Forecast API
- Open-Meteo Geocoding API

## Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## API

This project uses [Open-Meteo](https://open-meteo.com/), which does not require an API key for non-commercial use. The app uses:

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

The forecast call returns current conditions, hourly temperatures, 5-day daily highs/lows, UV index, precipitation probability, humidity, pressure, visibility, wind, sunrise, and sunset.

## Deployment

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Deploy. No environment variables are required.
