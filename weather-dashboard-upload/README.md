# Weather Dashboard

A polished React weather dashboard with live city search, current conditions, a 5-day forecast, and a 24-hour temperature chart powered by Weatherstack.

## Live Demo

Add your Vercel URL here after deployment.

## Screenshot

Add a screenshot after running the app locally or deploying it.

## Tech Stack

- React + Vite
- CSS variables and custom responsive CSS
- Recharts
- Lucide React icons
- Weatherstack API
- Vercel-ready environment variables

## Setup

1. Clone the repository.
2. Create a local `.env` file:

   ```bash
   VITE_WEATHERSTACK_API_KEY=your_weatherstack_access_key_here
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## API Key

Create a free account at [weatherstack.com](https://weatherstack.com/) and generate an API access key. The app uses:

- Current weather: `/current`
- Forecast weather: `/forecast`

Weatherstack current weather is available on all plans. Forecast data is available on Professional plans and higher, so the app shows a graceful empty state if your key does not include that endpoint.

Never commit `.env`; it is already ignored in `.gitignore`.

## Deployment

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Add `VITE_WEATHERSTACK_API_KEY` under Project Settings -> Environment Variables.
4. Deploy. Future pushes to `main` will auto-deploy.
