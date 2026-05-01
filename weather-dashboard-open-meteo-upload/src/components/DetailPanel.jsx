import { CloudRain, Compass, GaugeCircle, Waves } from "lucide-react";

export default function DetailPanel({ forecast, weather }) {
  if (!weather) return null;

  const current = weather.current || {};
  const today = forecast?.daily?.[0];
  const nextHour = forecast?.hourly?.[0];
  const precipitationChance = today?.precipitationProbability ?? nextHour?.precipitationProbability ?? 0;
  const precipitation = today?.precipitation ?? current.precipitation ?? 0;
  const humidity = current.humidity ?? 0;
  const pressure = current.pressure;
  const uvIndex = current.uvIndex ?? today?.uvIndex ?? "--";
  const precipitationUnit = forecast?.units?.precipitation || "mm";

  return (
    <section className="panel detail-panel fade-in">
      <div className="section-heading">
        <p className="eyebrow">Feels like</p>
        <h2>Comfort details</h2>
      </div>

      <div className="detail-list">
        <Detail icon={<Compass size={18} />} label="UV index" value={uvIndex} />
        <Detail icon={<CloudRain size={18} />} label="Precipitation" value={`${precipitationChance}% / ${precipitation} ${precipitationUnit}`} />
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
        <Detail icon={<GaugeCircle size={18} />} label="Air pressure" value={`${pressure ?? "--"} hPa`} />
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
