
import React from 'react';
import { WeatherData, Unit } from '../types';
import { 
  CloudIcon, 
  SunIcon, 
  CloudRainIcon, 
  SnowflakeIcon, 
  WindIcon, 
  DropletsIcon, 
  GaugeIcon,
  NavigationIcon
} from 'lucide-react';

interface WeatherCardProps {
  data: WeatherData;
  unit: Unit;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, unit }) => {
  const convertTemp = (c: number) => {
    return unit === Unit.CELSIUS ? Math.round(c) : Math.round((c * 9/5) + 32);
  };

  const getIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return <SunIcon className="w-20 h-20 text-yellow-400" />;
    if (c.includes('rain') || c.includes('drizzle')) return <CloudRainIcon className="w-20 h-20 text-blue-400" />;
    if (c.includes('snow')) return <SnowflakeIcon className="w-20 h-20 text-blue-200" />;
    return <CloudIcon className="w-20 h-20 text-gray-300" />;
  };

  return (
    <div className="glass rounded-3xl p-8 w-full max-w-4xl mx-auto animate-fade-in shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-5xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
            <NavigationIcon className="w-8 h-8 rotate-45" />
            {data.city}, {data.country}
          </h2>
          <p className="text-xl text-white/70 capitalize">{data.description}</p>
          <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
            <span className="text-8xl font-light tracking-tighter">
              {convertTemp(data.temp)}°
            </span>
            <div className="flex flex-col text-white/80">
              <span className="text-2xl font-medium">{unit === Unit.CELSIUS ? 'C' : 'F'}</span>
              <span className="text-lg">Feels like {convertTemp(data.feelsLike)}°</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {getIcon(data.condition)}
          <span className="mt-4 text-2xl font-semibold capitalize">{data.condition}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 border-t border-white/20 pt-8">
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all cursor-default">
          <DropletsIcon className="w-8 h-8 text-blue-300" />
          <div>
            <p className="text-white/60 text-sm">Humidity</p>
            <p className="text-xl font-bold">{data.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all cursor-default">
          <WindIcon className="w-8 h-8 text-emerald-300" />
          <div>
            <p className="text-white/60 text-sm">Wind Speed</p>
            <p className="text-xl font-bold">{data.windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all cursor-default">
          <GaugeIcon className="w-8 h-8 text-purple-300" />
          <div>
            <p className="text-white/60 text-sm">Pressure</p>
            <p className="text-xl font-bold">{data.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
