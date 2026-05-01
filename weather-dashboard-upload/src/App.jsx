import { useState } from "react";
import CurrentWeather from "./components/CurrentWeather";
import DetailPanel from "./components/DetailPanel";
import ForecastStrip from "./components/ForecastStrip";
import HourlyChart from "./components/HourlyChart";
import SearchBar from "./components/SearchBar";
import { useWeather } from "./hooks/useWeather";
import { getAtmosphere } from "./utils/formatters";

const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;

export default function App() {
  const {
    city,
    error,
    forecast,
    hasApiKey,
    history,
    loading,
    searchCity,
    toggleUnit,
    unit,
    weather,
  } = useWeather("Toronto", "metric");
  const [geoLoading, setGeoLoading] = useState(false);
  const atmosphere = getAtmosphere(weather);

  async function handleGeolocate() {
    if (!hasApiKey || !navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const query = new URLSearchParams({
            access_key: API_KEY,
            query: `${position.coords.latitude},${position.coords.longitude}`,
            units: unit === "metric" ? "m" : "f",
          });
          const response = await fetch(`https://api.weatherstack.com/current?${query}`);
          const data = await response.json();
          if (data?.location?.name) searchCity(data.location.name);
        } finally {
          setGeoLoading(false);
        }
      },
      () => setGeoLoading(false)
    );
  }

  return (
    <main className={`app atmosphere-${atmosphere}`}>
      <div className="atmosphere-layer" aria-hidden="true" />
      <div className="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">Weatherstack dashboard</p>
            <h1>Weather Console</h1>
          </div>
          <span className="status-pill">{loading || geoLoading ? "Updating" : "Live-ready"}</span>
        </header>

        <SearchBar
          defaultCity={city}
          history={history}
          loading={loading}
          onGeolocate={handleGeolocate}
          onSearch={searchCity}
        />

        {!hasApiKey && (
          <div className="notice">
            Add <code>VITE_WEATHERSTACK_API_KEY</code> to a local <code>.env</code> file, then restart the dev server.
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {loading && !weather ? (
          <div className="loading-card">Loading weather data...</div>
        ) : (
          <div className="layout-grid">
            <CurrentWeather weather={weather} unit={unit} onToggleUnit={toggleUnit} />
            <DetailPanel weather={weather} forecast={forecast} />
            <ForecastStrip forecast={forecast} unit={unit} />
            <HourlyChart forecast={forecast} unit={unit} />
          </div>
        )}
      </div>
    </main>
  );
}
