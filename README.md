# PakCast - Modern Weather Application

A sleek, modern weather dashboard built with React, TypeScript, and Vite. Features a responsive design, real-time weather data via OpenWeatherMap API, and dynamic background themes.

![PakCast Preview](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Features

- 🌤️ **Real-time Weather**: Current conditions for any city worldwide.
- 📅 **5-Day Forecast**: Accurate daily forecasts.
- 🌡️ **Unit Conversion**: Toggle between Celsius and Fahrenheit.
- 🎨 **Dynamic UI**: Beautiful glassmorphism effects and adaptive backgrounds.
- 📍 **Geolocation**: Auto-detect your local weather.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- An API Key from [OpenWeatherMap](https://openweathermap.org/api)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pakcast.git
   cd pakcast
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

   The app will run at `http://localhost:3000`.

## Built With

- React 19
- TypeScript
- Vite
- TailwindCSS
- Lucide React

## License

This project is open source and available under the [MIT License](LICENSE).
