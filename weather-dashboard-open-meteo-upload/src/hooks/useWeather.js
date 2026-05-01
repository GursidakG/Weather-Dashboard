import { useCallback, useEffect, useMemo, useState } from "react";
import { getWeatherCodeMeta } from "../utils/formatters";

const GEOCODING_ROOT = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_ROOT = "https://api.open-meteo.com/v1/forecast";

async function fetchJson(url) {
  const response = await fetch(url);
  const body = await response.json();

  if (!response.ok || body?.error) {
    throw new Error(body?.reason || body?.message || "Unable to fetch weather data");
  }

  return body;
}

function getUnitParams(unit) {
  if (unit === "imperial") {
    return {
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
    };
  }

  return {
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  };
}

async function geocodeCity(city) {
  const query = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });
  const data = await fetchJson(`${GEOCODING_ROOT}?${query.toString()}`);
  const location = data.results?.[0];

  if (!location) {
    throw new Error("City not found. Try another search.");
  }

  return location;
}

function normalizeWeather(location, data, unit) {
  const currentMeta = getWeatherCodeMeta(data.current?.weather_code, data.current?.is_day);
  const currentDayIndex = data.daily?.time?.[0] ? 0 : -1;

  const daily = (data.daily?.time || []).map((date, index) => {
    const meta = getWeatherCodeMeta(data.daily.weather_code?.[index], 1);
    return {
      date,
      condition: meta.label,
      icon: meta.icon,
      max: data.daily.temperature_2m_max?.[index],
      min: data.daily.temperature_2m_min?.[index],
      precipitationProbability: data.daily.precipitation_probability_max?.[index],
      precipitation: data.daily.precipitation_sum?.[index],
      sunrise: data.daily.sunrise?.[index],
      sunset: data.daily.sunset?.[index],
      uvIndex: data.daily.uv_index_max?.[index],
    };
  });

  const hourly = (data.hourly?.time || []).map((time, index) => {
    const meta = getWeatherCodeMeta(data.hourly.weather_code?.[index], 1);
    return {
      time,
      condition: meta.label,
      icon: meta.icon,
      temperature: data.hourly.temperature_2m?.[index],
      feelslike: data.hourly.apparent_temperature?.[index],
      humidity: data.hourly.relative_humidity_2m?.[index],
      precipitationProbability: data.hourly.precipitation_probability?.[index],
      precipitation: data.hourly.precipitation?.[index],
      pressure: data.hourly.pressure_msl?.[index],
      visibility: data.hourly.visibility?.[index],
      windSpeed: data.hourly.wind_speed_10m?.[index],
      uvIndex: data.hourly.uv_index?.[index],
    };
  });

  return {
    weather: {
      location: {
        name: location.name,
        country: location.country_code || location.country,
        region: location.admin1,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: data.timezone,
      },
      current: {
        temperature: data.current?.temperature_2m,
        feelslike: data.current?.apparent_temperature,
        humidity: data.current?.relative_humidity_2m,
        windSpeed: data.current?.wind_speed_10m,
        visibility: data.current?.visibility,
        pressure: data.current?.pressure_msl,
        precipitation: data.current?.precipitation,
        weatherCode: data.current?.weather_code,
        isDay: data.current?.is_day,
        condition: currentMeta.label,
        icon: currentMeta.icon,
        sunrise: currentDayIndex >= 0 ? data.daily.sunrise?.[currentDayIndex] : null,
        sunset: currentDayIndex >= 0 ? data.daily.sunset?.[currentDayIndex] : null,
        uvIndex: currentDayIndex >= 0 ? data.daily.uv_index_max?.[currentDayIndex] : null,
      },
      unit,
    },
    forecast: {
      daily,
      hourly,
      units: {
        precipitation: unit === "metric" ? "mm" : "in",
        pressure: "hPa",
        visibility: unit === "metric" ? "km" : "mi",
      },
    },
  };
}

export function useWeather(initialCity = "Toronto", initialUnit = "metric") {
  const [city, setCity] = useState(initialCity);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(initialUnit);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("weather-search-history")) || [];
    } catch {
      return [];
    }
  });

  const fetchWeatherForLocation = useCallback(
    async (location, nextUnit = unit, historyLabel = location.name) => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams({
          latitude: String(location.latitude),
          longitude: String(location.longitude),
          timezone: "auto",
          forecast_days: "5",
          current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "precipitation",
            "weather_code",
            "pressure_msl",
            "wind_speed_10m",
            "visibility",
          ].join(","),
          hourly: [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "precipitation_probability",
            "precipitation",
            "weather_code",
            "pressure_msl",
            "visibility",
            "wind_speed_10m",
            "uv_index",
          ].join(","),
          daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "sunrise",
            "sunset",
            "uv_index_max",
            "precipitation_probability_max",
            "precipitation_sum",
          ].join(","),
          ...getUnitParams(nextUnit),
        });

        const forecastData = await fetchJson(`${FORECAST_ROOT}?${query.toString()}`);
        const normalized = normalizeWeather(location, forecastData, nextUnit);

        setCity(location.name);
        setWeather(normalized.weather);
        setForecast(normalized.forecast);
        setHistory((previous) => {
          const next = [
            historyLabel,
            ...previous.filter((item) => item.toLowerCase() !== historyLabel.toLowerCase()),
          ].slice(0, 5);
          localStorage.setItem("weather-search-history", JSON.stringify(next));
          return next;
        });
      } catch (weatherError) {
        setError(weatherError.message || "Unable to load weather data.");
      } finally {
        setLoading(false);
      }
    },
    [unit]
  );

  const fetchWeather = useCallback(
    async (nextCity = city, nextUnit = unit) => {
      const normalizedCity = nextCity.trim();
      if (!normalizedCity) return;

      setLoading(true);
      setError(null);

      try {
        const location = await geocodeCity(normalizedCity);
        await fetchWeatherForLocation(location, nextUnit, location.name);
      } catch (weatherError) {
        setError(weatherError.message || "Unable to load weather data.");
        setLoading(false);
      }
    },
    [city, fetchWeatherForLocation, unit]
  );

  const searchCoordinates = useCallback(
    (latitude, longitude) => {
      fetchWeatherForLocation(
        {
          name: "Current Location",
          country: "",
          latitude,
          longitude,
        },
        unit,
        "Current Location"
      );
    },
    [fetchWeatherForLocation, unit]
  );

  const toggleUnit = useCallback(() => {
    setUnit((previous) => {
      const next = previous === "metric" ? "imperial" : "metric";
      fetchWeather(city, next);
      return next;
    });
  }, [city, fetchWeather]);

  const searchCity = useCallback(
    (nextCity) => {
      fetchWeather(nextCity, unit);
    },
    [fetchWeather, unit]
  );

  useEffect(() => {
    fetchWeather(initialCity, initialUnit);
  }, []);

  return useMemo(
    () => ({
      city,
      error,
      forecast,
      hasApiKey: true,
      history,
      loading,
      searchCity,
      searchCoordinates,
      setCity,
      toggleUnit,
      unit,
      weather,
    }),
    [city, error, forecast, history, loading, searchCity, searchCoordinates, toggleUnit, unit, weather]
  );
}
