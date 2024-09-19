import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression, Icon } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface WeatherMapProps {
  city: string;
  unit: 'metric' | 'imperial';
}

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

interface ForecastData {
  date: string;
  temperature: number;
}

interface ExtendedForecastData {
  date: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
}

const API_KEY = 'fa73fe458d998b96e90a2c8115904b14';

const customIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const WeatherMap: React.FC<WeatherMapProps> = ({ city, unit }) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [extendedForecastData, setExtendedForecastData] = useState<ExtendedForecastData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch coordinates
        const coordResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
        const coordData = await coordResponse.json();
        if (coordData.length > 0) {
          const [lat, lon] = [coordData[0].lat, coordData[0].lon];
          setCoordinates([lat, lon]);

          // Fetch current weather data
          const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`);
          const weatherData = await weatherResponse.json();
          setWeatherData({
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
          });

          // Fetch 5-day forecast data
          const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`);
          const forecastData = await forecastResponse.json();
          const extendedForecast = forecastData.list
            .filter((item: any, index: number) => index % 8 === 0) // Get one reading per day
            .map((item: any) => ({
              date: new Date(item.dt * 1000).toLocaleDateString(),
              temperature: item.main.temp,
              feelsLike: item.main.feels_like,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed,
            }));
          setExtendedForecastData(extendedForecast);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [city, unit]);

  const getTrend = () => {
    if (extendedForecastData.length < 2) return 'Not enough data';
    const firstTemp = extendedForecastData[0].temperature;
    const lastTemp = extendedForecastData[extendedForecastData.length - 1].temperature;
    const diff = lastTemp - firstTemp;
    if (diff > 2) return 'Rising temperatures';
    if (diff < -2) return 'Falling temperatures';
    return 'Stable temperatures';
  };

  if (!coordinates || !weatherData || extendedForecastData.length === 0) {
    return <div>Loading map and weather data...</div>;
  }

  return (
    <div className="weather-map">
      <h2>Weather Map for {city}</h2>
      <div className="row">
        <div className="col-md-6">
          <MapContainer center={coordinates as LatLngExpression} zoom={10} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <TileLayer
              url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
            />
            <Marker position={coordinates} icon={customIcon}>
              <Popup>
                <div>
                  <h3>{city}</h3>
                  <p>Temperature: {weatherData.temperature}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <p>Description: {weatherData.description}</p>
                  <p>Humidity: {weatherData.humidity}%</p>
                  <p>Wind Speed: {weatherData.windSpeed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                  <p>5-Day Trend: {getTrend()}</p>
                </div>
              </Popup>
            </Marker>
            <RecenterAutomatically lat={coordinates[0]} lng={coordinates[1]} />
          </MapContainer>
        </div>
        <div className="col-md-6">
          <div className="forecast-data">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={extendedForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-text)" opacity={0.3} />
                <XAxis dataKey="date" stroke="var(--card-text)" />
                <YAxis yAxisId="left" stroke="var(--card-text)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--card-text)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--card-text)',
                    borderRadius: '8px',
                    color: 'var(--card-text)',
                  }}
                />
                <Legend wrapperStyle={{ color: 'var(--card-text)' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', r: 4 }}
                  activeDot={{ r: 8 }}
                  name={`Temperature (°${unit === 'metric' ? 'C' : 'F'})`}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="feelsLike"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d', r: 4 }}
                  activeDot={{ r: 8 }}
                  name={`Feels Like (°${unit === 'metric' ? 'C' : 'F'})`}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  fill="#ffc658"
                  stroke="#ffc658"
                  name="Humidity (%)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={{ fill: '#ff7300', r: 4 }}
                  activeDot={{ r: 8 }}
                  name={`Wind Speed (${unit === 'metric' ? 'm/s' : 'mph'})`}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// This component is needed to update the map center when coordinates change
const RecenterAutomatically = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

export default WeatherMap;