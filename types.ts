
export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  icon: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  temp: number;
  condition: string;
  icon: string;
}

export enum Unit {
  CELSIUS = 'C',
  FAHRENHEIT = 'F'
}
