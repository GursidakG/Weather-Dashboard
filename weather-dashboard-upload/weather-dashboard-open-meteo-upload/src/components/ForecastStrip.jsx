import { formatDay, formatTemperature, getForecastDays } from "../utils/formatters";

export default function ForecastStrip({ forecast, unit }) {
  const days = getForecastDays(forecast);

  return (
    <section className="panel forecast-panel fade-in">
      <div className="section-heading">
        <p className="eyebrow">Forecast</p>
        <h2>Next 5 days</h2>
      </div>
      {days.length > 0 ? (
        <div className="forecast-strip">
          {days.map((day) => (
            <article className="forecast-day" key={day.date}>
              <strong>{formatDay(day.date)}</strong>
              <span className="weather-icon" aria-label={day.condition} role="img">
                {day.icon}
              </span>
              <span>{formatTemperature(day.max, unit)}</span>
              <small>{formatTemperature(day.min, unit)}</small>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">Forecast data is unavailable right now.</p>
      )}
    </section>
  );
}
