
import React from 'react';
import { ForecastDay, Unit } from '../types';
import { SunIcon, CloudIcon, CloudRainIcon, SnowflakeIcon } from 'lucide-react';

interface ForecastProps {
  forecast: ForecastDay[];
  unit: Unit;
}

const Forecast: React.FC<ForecastProps> = ({ forecast, unit }) => {
  const convertTemp = (c: number) => {
    return unit === Unit.CELSIUS ? Math.round(c) : Math.round((c * 9/5) + 32);
  };

  const getSmallIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return <SunIcon className="w-8 h-8 text-yellow-400" />;
    if (c.includes('rain') || c.includes('drizzle')) return <CloudRainIcon className="w-8 h-8 text-blue-400" />;
    if (c.includes('snow')) return <SnowflakeIcon className="w-8 h-8 text-blue-200" />;
    return <CloudIcon className="w-8 h-8 text-gray-300" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-2xl font-semibold mb-6 px-4">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.slice(0, 5).map((day, idx) => (
          <div key={idx} className="glass rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <span className="text-white/70 font-medium mb-3">{day.date}</span>
            {getSmallIcon(day.condition)}
            <span className="text-2xl font-bold mt-3">{convertTemp(day.temp)}°</span>
            <span className="text-xs text-white/50 mt-1 capitalize text-center">{day.condition}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
