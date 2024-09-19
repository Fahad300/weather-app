import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faTint, faWind } from '@fortawesome/free-solid-svg-icons';
import WeatherIcon from './WeatherIcon';

const API_KEY = 'fa73fe458d998b96e90a2c8115904b14';
const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

interface ForecastData {
  date: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
}

interface WeatherForecastProps {
  city: string;
  unit: 'metric' | 'imperial';
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ city, unit }) => {
  const [forecast, setForecast] = useState<ForecastData[]>([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(`${API_URL}?q=${city}&appid=${API_KEY}&units=${unit}`);
        const forecastData = response.data.list
          .filter((_: any, index: number) => index % 8 === 0) // Get data for every 24 hours
          .slice(0, 5) // Get only 5 days
          .map((item: any) => ({
            date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            temperature: Math.round(item.main.temp),
            description: item.weather[0].description,
            icon: item.weather[0].main,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed),
            isDay: item.sys.pod === 'd',
          }));
        setForecast(forecastData);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };

    if (city) {
      fetchForecast();
    }
  }, [city, unit]);

  return (
    <div className="weather-forecast mt-4">
      <h3 className="mb-3">5-Day Forecast</h3>
      <div className="d-flex flex-wrap justify-content-between">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-card mb-3" style={{ flexBasis: 'calc(20% - 10px)', minWidth: '200px' }}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">{day.date}</h5>
                  <div className="weather-icon">
                    <WeatherIcon type={day.icon} isDay={day.isDay} />
                  </div>
                </div>
                <div className="mt-auto">
                  <p className="temperature mb-2">{day.temperature}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <p className="description mb-2">{day.description}</p>
                  <div className="details">
                    <p className="mb-1"><FontAwesomeIcon icon={faTint} /> Humidity: {day.humidity}%</p>
                    <p className="mb-0"><FontAwesomeIcon icon={faWind} /> Wind: {day.windSpeed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;