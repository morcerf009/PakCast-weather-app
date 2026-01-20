
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, ForecastDay } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Note: Using a public API for raw weather data. 
// For this demo, we use OpenWeatherMap structure but since we can't manage keys easily 
// we will simulate the fetch or use the search grounding to find real data.
export const fetchWeatherByQuery = async (query: string): Promise<WeatherData> => {
  // We use Gemini to act as an intelligent gateway for real-time data using search grounding
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Get current weather and 5-day forecast for ${query}. Return JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          city: { type: Type.STRING },
          country: { type: Type.STRING },
          temp: { type: Type.NUMBER, description: "Temperature in Celsius" },
          condition: { type: Type.STRING },
          description: { type: Type.STRING },
          humidity: { type: Type.NUMBER },
          windSpeed: { type: Type.NUMBER },
          pressure: { type: Type.NUMBER },
          feelsLike: { type: Type.NUMBER },
          icon: { type: Type.STRING, description: "sunny, cloudy, rainy, snowy, or stormy" },
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                temp: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                icon: { type: Type.STRING }
              }
            }
          }
        },
        required: ["city", "temp", "condition", "forecast"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw new Error("Failed to parse weather data");
  }
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  return fetchWeatherByQuery(`at latitude ${lat} and longitude ${lon}`);
};

export const getAutocompleteSuggestions = async (query: string): Promise<string[]> => {
  if (query.length < 3) return [];
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `List 5 major cities starting with "${query}". Return as a simple JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};
