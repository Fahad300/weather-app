import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherInfo from './WeatherInfo';
import WeatherForecast from './WeatherForecast';
import FavoriteCities from './FavoriteCities';
import WorldNews from './WorldNews'; // Add this line
import './WeatherDashboard.css';
import WeatherMap from './WeatherMap';
import '../styles/weather-icons.css';

const API_KEY = 'fa73fe458d998b96e90a2c8115904b14';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

interface WeatherDashboardProps {
  unit: 'metric' | 'imperial';
  onToggleUnit: () => void;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ unit, onToggleUnit }) => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mostSearchedCities, setMostSearchedCities] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCities');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    const savedMostSearched = localStorage.getItem('mostSearchedCities');
    if (savedMostSearched) {
      setMostSearchedCities(JSON.parse(savedMostSearched));
    }
  }, []);

  const fetchWeatherData = async (cityName: string) => {
    try {
      const response = await axios.get(`${API_URL}?q=${cityName}&appid=${API_KEY}&units=${unit}`);
      setWeatherData({
        city: response.data.name,
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        feelsLike: response.data.main.feels_like,
      });
      setError(null);
      updateMostSearchedCities(response.data.name);
    } catch (err) {
      setWeatherData(null);
      setError('Error fetching weather data. Please try again.');
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const addToFavorites = () => {
    if (weatherData && !favorites.includes(weatherData.city)) {
      const newFavorites = [...favorites, weatherData.city];
      setFavorites(newFavorites);
      localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
    }
  };

  const toggleFavorite = (city: string) => {
    const newFavorites = favorites.includes(city)
      ? favorites.filter(fav => fav !== city)
      : [...favorites, city];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (cityToRemove: string) => {
    const newFavorites = favorites.filter(city => city !== cityToRemove);
    setFavorites(newFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
  };

  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(`${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`);
            setCurrentLocation(response.data.name);
            fetchWeatherData(response.data.name);
          } catch (err) {
            setError('Error fetching current location weather data.');
          }
        },
        () => {
          setError('Unable to retrieve your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    if (value.length > 2) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`);
        const cities = response.data.map((item: any) => `${item.name}, ${item.country}`);
        setSearchResults(cities);
      } catch (err) {
        console.error('Error fetching city suggestions:', err);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (weatherData) {
      fetchWeatherData(weatherData.city);
    }
  }, [unit]);

  const updateMostSearchedCities = (cityName: string) => {
    const updatedMostSearched = [cityName, ...mostSearchedCities.filter(city => city !== cityName)].slice(0, 3);
    setMostSearchedCities(updatedMostSearched);
    localStorage.setItem('mostSearchedCities', JSON.stringify(updatedMostSearched));
  };

  return (
    <div className="weather-dashboard">
      <div className="container-fluid">
        <div className="row">
          <aside className="col-md-2">
            <div className="search-container my-3">
              <h4 className="mb-3">Search for a city</h4>
              <div className="input-group mb-2">
                <input
                  type="text"
                  value={city}
                  onChange={handleInputChange}
                  placeholder="Enter city name"
                  className='form-control custom-placeholder'
                />
                <button className='btn btn-primary' onClick={handleSearch}>Search</button>
              </div>
              {searchResults.length > 0 && (
                <ul className="list-group mt-2">
                  {searchResults.map((result, index) => (
                    <li 
                      key={index} 
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setCity(result);
                        fetchWeatherData(result);
                        setSearchResults([]);
                      }}
                    >
                      {result}
                    </li>
                  ))}
                </ul>
              )}
              <div className="most-searched mb-3">
                <div className="d-flex flex-wrap">
                  {mostSearchedCities.map((city, index) => (
                    <span
                      key={index}
                      className="badge me-2"
                      onClick={() => fetchWeatherData(city)}
                      style={{ cursor: 'pointer' }}
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {error && <p className="error alert alert-danger">{error}</p>}
            
            <FavoriteCities 
              favorites={favorites} 
              onSelectCity={fetchWeatherData} 
              onRemoveCity={removeFromFavorites}
            />
          </aside>
          
          <main className="col-md-7">
            {weatherData && (
              <>
                <WeatherInfo 
                  data={weatherData} 
                  unit={unit} 
                  isFavorite={favorites.includes(weatherData.city)}
                  onToggleFavorite={() => toggleFavorite(weatherData.city)}
                />
                <WeatherForecast city={weatherData.city} unit={unit} />
              </>
            )}
          </main>
          <aside className="col-md-3">
            <div className="news-container">
              <h4>World News</h4>
              <WorldNews />
            </div>
          </aside>
        </div>
        {weatherData && (
          <div className="row mt-4">
            <div className="col-12">
              <WeatherMap city={weatherData.city} unit={unit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;