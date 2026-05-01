import { useState } from "react";
import CurrentWeather from "./components/CurrentWeather";
import DetailPanel from "./components/DetailPanel";
import ForecastStrip from "./components/ForecastStrip";
import HourlyChart from "./components/HourlyChart";
import SearchBar from "./components/SearchBar";
import { useWeather } from "./hooks/useWeather";
import { getAtmosphere } from "./utils/formatters";

export default function App() {
  const {
    city,
    error,
    forecast,
    history,
    loading,
    searchCity,
    searchCoordinates,
    toggleUnit,
    unit,
    weather,
  } = useWeather("Toronto", "metric");
  const [geoLoading, setGeoLoading] = useState(false);
  const atmosphere = getAtmosphere(weather);

  async function handleGeolocate() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        searchCoordinates(position.coords.latitude, position.coords.longitude);
        setGeoLoading(false);
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
            <p className="eyebrow">Open-Meteo dashboard</p>
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
