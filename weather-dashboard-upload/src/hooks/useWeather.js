import { useCallback, useEffect, useMemo, useState } from "react";

const API_ROOT = "https://api.weatherstack.com";
const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;

async function fetchJson(url) {
  const response = await fetch(url);
  const body = await response.json();

  if (!response.ok || body?.success === false || body?.error) {
    throw new Error(body?.error?.info || body?.message || "Unable to fetch weather data");
  }

  return body;
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

  const hasApiKey = Boolean(API_KEY && API_KEY !== "your_weatherstack_access_key_here");

  const fetchWeather = useCallback(
    async (nextCity = city, nextUnit = unit) => {
      const normalizedCity = nextCity.trim();
      if (!normalizedCity) return;

      if (!hasApiKey) {
        setError("Add VITE_WEATHERSTACK_API_KEY to your .env file to load live weather.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams({
          access_key: API_KEY,
          query: normalizedCity,
          units: nextUnit === "metric" ? "m" : "f",
        });

        const currentWeather = await fetchJson(`${API_ROOT}/current?${query.toString()}`);
        let forecastWeather = null;

        try {
          const forecastQuery = new URLSearchParams(query);
          forecastQuery.set("forecast_days", "5");
          forecastQuery.set("hourly", "1");
          forecastQuery.set("interval", "3");
          forecastWeather = await fetchJson(`${API_ROOT}/forecast?${forecastQuery.toString()}`);
        } catch (forecastError) {
          forecastWeather = {
            unavailableReason: forecastError.message,
          };
        }

        setCity(currentWeather.location?.name || normalizedCity);
        setWeather(currentWeather);
        setForecast(forecastWeather);
        setHistory((previous) => {
          const next = [
            normalizedCity,
            ...previous.filter((item) => item.toLowerCase() !== normalizedCity.toLowerCase()),
          ].slice(0, 5);
          localStorage.setItem("weather-search-history", JSON.stringify(next));
          return next;
        });
      } catch (weatherError) {
        setError(
          weatherError.message?.toLowerCase() === "city not found"
            ? "City not found. Try another search."
            : weatherError.message
        );
      } finally {
        setLoading(false);
      }
    },
    [city, hasApiKey, unit]
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
      hasApiKey,
      history,
      loading,
      searchCity,
      setCity,
      toggleUnit,
      unit,
      weather,
    }),
    [city, error, forecast, hasApiKey, history, loading, searchCity, toggleUnit, unit, weather]
  );
}
