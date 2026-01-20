import { WeatherData, ForecastDay } from '../types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.warn("OpenWeatherMap API Key is missing! Please set VITE_OPENWEATHER_API_KEY in .env.local");
}

const mapIcon = (iconCode: string): string => {
  // Mapping OWM icons to our description keywords for background images
  // or just returning a descriptive string that our UI can handle.
  // The UI seems to check "sunny, cloudy, rainy, snowy, or stormy" in types? 
  // Let's map OWM codes to these generic terms if possible, or just pass the condition.
  // Actually, looking at App.tsx, it uses condition.toLowerCase() for unsplash background.
  // The icon field in ForecastDay is likely used for display.
  // For now, let's return the condition string or a simple map.

  if (iconCode.startsWith('01')) return 'sunny';
  if (iconCode.startsWith('02') || iconCode.startsWith('03') || iconCode.startsWith('04')) return 'cloudy';
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) return 'rainy';
  if (iconCode.startsWith('11')) return 'stormy';
  if (iconCode.startsWith('13')) return 'snowy';
  return 'cloudy';
};

export const fetchWeatherByQuery = async (query: string): Promise<WeatherData> => {
  if (!API_KEY) throw new Error("API Key is missing. Check .env.local");

  try {
    // 1. Get Current Weather
    const weatherRes = await fetch(`${BASE_URL}/weather?q=${query}&units=metric&appid=${API_KEY}`);
    if (!weatherRes.ok) throw new Error("City not found");
    const weatherData = await weatherRes.json();

    // 2. Get Forecast (5 days / 3 hour intervals)
    const forecastRes = await fetch(`${BASE_URL}/forecast?q=${query}&units=metric&appid=${API_KEY}`);
    const forecastData = await forecastRes.ok ? await forecastRes.json() : { list: [] };

    // Process Forecast: OWM returns 3-hour intervals. We want daily.
    // We'll roughly pick one entry per day (e.g., noon) or just the next 5 entries if we want simple.
    // Let's filter for approx noon data (12:00:00) to represent the day.
    const dailyForecast: ForecastDay[] = [];
    const seenDates = new Set();

    if (forecastData.list) {
      for (const item of forecastData.list) {
        const date = item.dt_txt.split(' ')[0];
        if (!seenDates.has(date) && seenDates.size < 5) {
          // Skip today if we already have current weather? usually we want upcoming days.
          // Let's just take unique dates.
          if (date !== new Date().toISOString().split('T')[0]) {
            seenDates.add(date);
            dailyForecast.push({
              date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
              temp: Math.round(item.main.temp),
              condition: item.weather[0].main,
              icon: mapIcon(item.weather[0].icon)
            });
          }
        }
      }
    }

    return {
      city: weatherData.name,
      country: weatherData.sys.country,
      temp: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      pressure: weatherData.main.pressure,
      feelsLike: Math.round(weatherData.main.feels_like),
      icon: mapIcon(weatherData.weather[0].icon),
      forecast: dailyForecast
    };

  } catch (error: any) {
    console.error("Weather fetch error:", error);
    throw new Error(error.message || "Failed to fetch weather data");
  }
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!API_KEY) throw new Error("API Key is missing. Check .env.local");

  try {
    // 1. Get Current Weather
    const weatherRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    if (!weatherRes.ok) throw new Error("Location not found");
    const weatherData = await weatherRes.json();

    // 2. Get Forecast
    const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    const forecastData = await forecastRes.ok ? await forecastRes.json() : { list: [] };

    const dailyForecast: ForecastDay[] = [];
    const seenDates = new Set();

    if (forecastData.list) {
      for (const item of forecastData.list) {
        const date = item.dt_txt.split(' ')[0];
        if (!seenDates.has(date) && seenDates.size < 5) {
          if (date !== new Date().toISOString().split('T')[0]) {
            seenDates.add(date);
            dailyForecast.push({
              date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
              temp: Math.round(item.main.temp),
              condition: item.weather[0].main,
              icon: mapIcon(item.weather[0].icon)
            });
          }
        }
      }
    }

    return {
      city: weatherData.name,
      country: weatherData.sys.country,
      temp: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      pressure: weatherData.main.pressure,
      feelsLike: Math.round(weatherData.main.feels_like),
      icon: mapIcon(weatherData.weather[0].icon),
      forecast: dailyForecast
    };

  } catch (error: any) {
    console.error("Weather fetch error:", error);
    throw new Error(error.message || "Failed to fetch weather data");
  }
};


