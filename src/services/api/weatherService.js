import weatherData from "@/services/mockData/weather.json";

let lastFetch = null;
let cachedWeather = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const weatherService = {
  async getCurrent(location = "Farm Location") {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const now = Date.now();
    
    // Return cached data if still valid
    if (cachedWeather && lastFetch && (now - lastFetch) < CACHE_DURATION) {
      return cachedWeather;
    }
    
    // Simulate API call and cache the result
    const currentWeather = {
      ...weatherData,
      location,
      lastUpdated: new Date().toISOString()
    };
    
    cachedWeather = currentWeather;
    lastFetch = now;
    
    return currentWeather;
  },

  async getForecast(location = "Farm Location", days = 5) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      location,
      forecast: weatherData.forecast.slice(0, days)
    };
  }
};