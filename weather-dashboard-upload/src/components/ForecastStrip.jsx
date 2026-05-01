import { formatDay, formatTemperature, getForecastDays, getIconUrl } from "../utils/formatters";

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
          {days.map((day) => {
            const midday = day.hourly?.find((hour) => Number(hour.time) >= 1200) || day.hourly?.[0];
            const icon = midday?.weather_icons?.[0];
            const condition = midday?.weather_descriptions?.[0] || "Forecast";
            return (
              <article className="forecast-day" key={day.date}>
                <strong>{formatDay(day.date)}</strong>
                {icon && <img className="weather-icon" src={getIconUrl(icon)} alt={condition} />}
                <span>{formatTemperature(day.maxtemp ?? midday?.temperature, unit)}</span>
                <small>{formatTemperature(day.mintemp ?? midday?.temperature, unit)}</small>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="empty-state">{forecast?.unavailableReason || "Forecast data is unavailable for this key."}</p>
      )}
    </section>
  );
}
