import React, { useState, useEffect } from 'react';
import { WeatherData, Unit } from './types';
import { fetchWeatherByQuery, fetchWeatherByCoords } from './services/weatherService';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import { SearchIcon, MapPinIcon, Loader2Icon, ThermometerIcon, XIcon, CloudSunIcon } from 'lucide-react';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [unit, setUnit] = useState<Unit>(Unit.CELSIUS);
  const [bgImage, setBgImage] = useState<string>('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1920&q=80');

  // Reliable static background images from Unsplash
  const weatherBackgrounds: { [key: string]: string } = {
    clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920&q=80', // Sunny
    clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80', // Cloudy
    rain: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920&q=80', // Rainy
    drizzle: 'https://images.unsplash.com/photo-1556485689-33e55ab56ce0?auto=format&fit=crop&w=1920&q=80', // Drizzle
    thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1920&q=80', // Storm
    snow: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?auto=format&fit=crop&w=1920&q=80', // Snow
    mist: 'https://images.unsplash.com/photo-1485230905346-71acb9518d9c?auto=format&fit=crop&w=1920&q=80', // Mist/Fog
    default: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1920&q=80' // Default
  };

  const getBackgroundImage = (condition: string): string => {
    const c = condition.toLowerCase();
    if (c.includes('clear') || c.includes('sun')) return weatherBackgrounds.clear;
    if (c.includes('cloud')) return weatherBackgrounds.clouds;
    if (c.includes('rain')) return weatherBackgrounds.rain;
    if (c.includes('drizzle')) return weatherBackgrounds.drizzle;
    if (c.includes('thunder') || c.includes('storm')) return weatherBackgrounds.thunderstorm;
    if (c.includes('snow')) return weatherBackgrounds.snow;
    if (c.includes('mist') || c.includes('fog')) return weatherBackgrounds.mist;
    return weatherBackgrounds.default;
  };

  const updateWeather = async (fn: () => Promise<WeatherData>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fn();
      setWeather(data);
      // Update background based on weather condition
      setBgImage(getBackgroundImage(data.condition));
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    updateWeather(() => fetchWeatherByQuery(query));
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateWeather(() => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude));
      },
      () => {
        setError("Location access denied.");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    updateWeather(() => fetchWeatherByQuery("London"));
  }, []);

  return (
    <div
      className="weather-bg relative min-h-screen transition-all duration-1000"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${bgImage}')` }}
    >
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-lg border border-white/20">
            <CloudSunIcon className="w-8 h-8 text-yellow-300" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">PakCast</h1>
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Weather Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setUnit(u => u === Unit.CELSIUS ? Unit.FAHRENHEIT : Unit.CELSIUS)}
            className="glass p-3 rounded-full hover:bg-white/30 transition-all flex items-center gap-2 border border-white/20"
          >
            <ThermometerIcon className="w-5 h-5 text-blue-200" />
            <span className="font-bold text-sm">°{unit}</span>
          </button>
          <button
            onClick={handleGeolocation}
            className="glass p-3 rounded-full hover:bg-white/30 transition-all border border-white/20"
            title="Use my location"
          >
            <MapPinIcon className="w-5 h-5 text-emerald-300" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 pb-12 flex flex-col items-center">
        <div className="w-full max-w-xl mb-12 relative group">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter city name..."
              className="w-full glass bg-white/10 rounded-2xl py-5 px-6 pl-14 outline-none focus:bg-white/20 transition-all text-xl placeholder:text-white/40 border border-white/10"
            />
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 w-6 h-6" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 hover:text-red-400 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200 mb-8 max-w-md text-center animate-fade-in backdrop-blur-md">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-4 my-10 animate-pulse">
            <Loader2Icon className="w-12 h-12 animate-spin text-blue-400" />
            <p className="text-white/70 font-medium tracking-wide">Syncing PakCast data...</p>
          </div>
        )}

        {!loading && weather && (
          <>
            <WeatherCard data={weather} unit={unit} />
            <Forecast forecast={weather.forecast} unit={unit} />
          </>
        )}
      </main>

      <footer className="mt-auto p-12 text-center text-white/40 text-sm">
        <div className="flex flex-col gap-1 items-center">
          <p className="font-semibold tracking-wide">© 2025 PakCast Weather</p>
          <p className="text-xs uppercase tracking-widest">Designed and Created by <span className="text-white/70">MZL</span></p>
          <div className="w-8 h-1 bg-white/10 rounded-full mt-4"></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
