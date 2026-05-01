import { Droplets, Eye, Gauge, Sunrise, Sunset, Wind } from "lucide-react";
import {
  formatTemperature,
  formatTime,
  formatVisibility,
  formatWind,
  getIconUrl,
  titleCase,
} from "../utils/formatters";

export default function CurrentWeather({ unit, weather, onToggleUnit }) {
  if (!weather) return null;

  const location = weather.location || {};
  const current = weather.current || {};
  const description = current.weather_descriptions?.[0] || "Current conditions";
  const icon = current.weather_icons?.[0];

  return (
    <section className="current-card fade-in">
      <div className="current-main">
        <div>
          <p className="eyebrow">Current weather</p>
          <h1>
            {location.name}, {location.country}
          </h1>
          <p className="condition">{titleCase(description)}</p>
        </div>

        {icon && (
          <img
            className="weather-icon hero-icon"
            src={getIconUrl(icon)}
            alt={description}
          />
        )}
      </div>

      <div className="temperature-row">
        <div className="temperature">{formatTemperature(current.temperature, unit)}</div>
        <button className="unit-toggle" type="button" onClick={onToggleUnit}>
          {unit === "metric" ? "Show °F" : "Show °C"}
        </button>
      </div>

      <div className="metric-grid">
        <Metric icon={<Gauge size={18} />} label="Feels like" value={formatTemperature(current.feelslike, unit)} />
        <Metric icon={<Droplets size={18} />} label="Humidity" value={`${current.humidity ?? "--"}%`} />
        <Metric icon={<Wind size={18} />} label="Wind" value={formatWind(current.wind_speed, unit)} />
        <Metric icon={<Eye size={18} />} label="Visibility" value={formatVisibility(current.visibility, unit)} />
        <Metric icon={<Sunrise size={18} />} label="Sunrise" value={formatTime(current.astro?.sunrise)} />
        <Metric icon={<Sunset size={18} />} label="Sunset" value={formatTime(current.astro?.sunset)} />
      </div>
    </section>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      <span className="metric-icon">{icon}</span>
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}
