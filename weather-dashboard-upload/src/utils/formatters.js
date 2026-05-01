export function formatTemperature(value, unit = "metric") {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${Math.round(value)}°${unit === "metric" ? "C" : "F"}`;
}

export function formatTime(value) {
  return value || "--";
}

export function formatWeatherstackHour(value) {
  const padded = String(value ?? "0").padStart(4, "0");
  const hour = Number(padded.slice(0, 2));
  if (Number.isNaN(hour)) return "--";
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
}

export function formatDay(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(date);
}

export function formatVisibility(value, unit = "metric") {
  if (value === null || value === undefined) return "--";
  return `${value} ${unit === "metric" ? "km" : "mi"}`;
}

export function formatWind(speed, unit = "metric") {
  if (speed === null || speed === undefined) return "--";
  return `${Math.round(speed)} ${unit === "metric" ? "km/h" : "mph"}`;
}

export function titleCase(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getIconUrl(iconCode) {
  return iconCode || "";
}

export function getForecastDays(forecast) {
  if (!forecast?.forecast) return [];
  return (Array.isArray(forecast.forecast)
    ? forecast.forecast
    : Object.entries(forecast.forecast).map(([date, day]) => ({
        date,
        ...day,
      }))
  ).slice(0, 5);
}

export function getAtmosphere(weather) {
  const condition = weather?.current?.weather_descriptions?.[0]?.toLowerCase() || "clear";
  const isDay = weather?.current?.is_day;
  const isNight = isDay === "no";

  if (isNight) return "night";
  if (condition.includes("rain") || condition.includes("drizzle")) return "rain";
  if (condition.includes("storm") || condition.includes("thunder")) return "storm";
  if (condition.includes("snow")) return "snow";
  if (condition.includes("cloud")) return "clouds";
  if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
    return "mist";
  }
  return "clear";
}
