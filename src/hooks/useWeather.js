import { useState, useEffect } from "react";
import { weatherService } from "@/services/api/weatherService";

export const useWeather = (location) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await weatherService.getCurrent(location);
      setWeather(data);
    } catch (err) {
      setError(err.message || "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [location]);

  return {
    weather,
    loading,
    error,
    refetch: loadWeather
  };
};