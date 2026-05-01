import { CloudRain, Compass, GaugeCircle, Waves } from "lucide-react";

export default function DetailPanel({ forecast, weather }) {
  if (!weather) return null;

  const current = weather.current || {};
  const firstHour = Array.isArray(forecast?.forecast)
    ? forecast.forecast[0]?.hourly?.[0]
    : Object.values(forecast?.forecast || {})[0]?.hourly?.[0];
  const precipitation = firstHour?.precip ?? current.precip ?? 0;
  const humidity = current.humidity ?? 0;
  const pressure = current.pressure;
  const uvIndex = current.uv_index ?? "--";

  return (
    <section className="panel detail-panel fade-in">
      <div className="section-heading">
        <p className="eyebrow">Feels like</p>
        <h2>Comfort details</h2>
      </div>

      <div className="detail-list">
        <Detail icon={<Compass size={18} />} label="UV index" value={uvIndex} />
        <Detail icon={<CloudRain size={18} />} label="Precipitation" value={`${precipitation} ${weather.request?.unit === "f" ? "in" : "mm"}`} />
        <div className="detail-item detail-item-bar">
          <span className="metric-icon"><Waves size={18} /></span>
          <span>
            <small>Humidity</small>
            <strong>{humidity}%</strong>
            <span className="bar" aria-hidden="true">
              <span style={{ width: `${humidity}%` }} />
            </span>
          </span>
        </div>
        <Detail icon={<GaugeCircle size={18} />} label="Air pressure" value={`${pressure ?? "--"} mb`} />
      </div>
    </section>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="detail-item">
      <span className="metric-icon">{icon}</span>
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}
