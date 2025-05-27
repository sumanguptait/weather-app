import { useState } from "react";
import "./App.css";

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
}

function App() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<WeatherData[]>([]);
  const [error, setError] = useState<string>("");

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city) {
      return;
    }
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},in&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      // console.log(data);
      if (response.ok) {
        const weatherData: WeatherData = {
          city: data.name,
          temperature: data.main.temp,
          description: data.weather[0].description,
          humidity: data.main.humidity,
        };
        // console.log(weatherData);
        setWeather(weatherData);
        setHistory((prevHistory) => [...prevHistory, weatherData]);
        setError("");
      } else {
        setWeather(null);
        setError(data.message);
      }
    } catch (error) {
      setWeather(null);
      setError("Error to fetch weather data");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };
  const handleDeleteHistory = (cityToDelete: string) => {
    setHistory((prev) => prev.filter((item) => item.city !== cityToDelete));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-sm w-full text-center">
        <h1 className="text-2xl font-semibold text-blue-600 mb-4">
          Weather App
        </h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            className="w-full px-3 py-2 border rounded-md mb-2"
            type="text"
            placeholder="Enter City Name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Get Weather
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {weather && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">{weather.city}</h2>
              <p>Temperature: {weather.temperature}</p>
              <p>Humidity: {weather.humidity}</p>
              <p className="text-gray-700">Condition: {weather.description}</p>
            </div>
          )}
          {history.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="text-md font-semibold mb-2">History</h3>
              <ul className="text-sm space-y-2 max-h-40 overflow-y-auto">
                {history.map((item, index) => (
                  <li
                    className="border p-2 rounded bg-gray-50 flex justify-between items-center"
                    key={index}
                  >
                    <strong>{item.city}</strong> - {item.temperature} C,{" "}
                    {item.description}
                    <button
                      className="bg-red-400 hover:bg-red-600 text-sm px-3 py-1 rounded"
                      onClick={() => handleDeleteHistory(item.city)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
