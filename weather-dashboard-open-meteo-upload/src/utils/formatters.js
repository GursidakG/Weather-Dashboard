export function formatTemperature(value, unit = "metric") {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${Math.round(value)}°${unit === "metric" ? "C" : "F"}`;
}

export function formatTime(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

export function formatHour(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    hour12: true,
  }).format(new Date(value));
}

export function formatDay(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(date);
}

export function formatVisibility(value, unit = "metric") {
  if (value === null || value === undefined) return "--";
  if (unit === "metric") return `${Math.round(value / 1000)} km`;
  return `${Math.round(value / 1609.344)} mi`;
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

export function getForecastDays(forecast) {
  return forecast?.daily || [];
}

export function getAtmosphere(weather) {
  const condition = weather?.current?.condition?.toLowerCase() || "clear";
  const isNight = weather?.current?.isDay === 0;

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

export function getWeatherCodeMeta(code, isDay = 1) {
  const value = Number(code);
  const night = Number(isDay) === 0;

  if (value === 0) return { label: "Clear", icon: night ? "☾" : "☀" };
  if ([1, 2].includes(value)) return { label: "Partly cloudy", icon: night ? "☾" : "◐" };
  if (value === 3) return { label: "Cloudy", icon: "☁" };
  if ([45, 48].includes(value)) return { label: "Fog", icon: "≋" };
  if ([51, 53, 55, 56, 57].includes(value)) return { label: "Drizzle", icon: "☂" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(value)) return { label: "Rain", icon: "☔" };
  if ([71, 73, 75, 77, 85, 86].includes(value)) return { label: "Snow", icon: "❄" };
  if ([95, 96, 99].includes(value)) return { label: "Thunderstorm", icon: "ϟ" };
  return { label: "Current conditions", icon: "◌" };
}
