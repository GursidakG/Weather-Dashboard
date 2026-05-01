import { Droplets, Eye, Gauge, Sunrise, Sunset, Wind } from "lucide-react";
import {
  formatTemperature,
  formatTime,
  formatVisibility,
  formatWind,
  titleCase,
} from "../utils/formatters";

export default function CurrentWeather({ unit, weather, onToggleUnit }) {
  if (!weather) return null;

  const location = weather.location || {};
  const current = weather.current || {};
  const description = current.condition || "Current conditions";

  return (
    <section className="current-card fade-in">
      <div className="current-main">
        <div>
          <p className="eyebrow">Current weather</p>
          <h1>
            {location.name}{location.country ? `, ${location.country}` : ""}
          </h1>
          <p className="condition">{titleCase(description)}</p>
        </div>

        <span className="weather-icon hero-icon" aria-label={description} role="img">
          {current.icon}
        </span>
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
        <Metric icon={<Wind size={18} />} label="Wind" value={formatWind(current.windSpeed, unit)} />
        <Metric icon={<Eye size={18} />} label="Visibility" value={formatVisibility(current.visibility, unit)} />
        <Metric icon={<Sunrise size={18} />} label="Sunrise" value={formatTime(current.sunrise)} />
        <Metric icon={<Sunset size={18} />} label="Sunset" value={formatTime(current.sunset)} />
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
