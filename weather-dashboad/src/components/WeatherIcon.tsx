import React from 'react';
import clearDay from '../icons/static/clear-day.svg';
import clearNight from '../icons/static/clear-night.svg';
import cloudyDay from '../icons/static/cloudy-2-day.svg';
import cloudyNight from '../icons/static/cloudy-2-night.svg';
import cloudy from '../icons/static/cloudy.svg';
import rainDay from '../icons/static/rainy-2-day.svg';
import rainNight from '../icons/static/rainy-2-night.svg';
import drizzle from '../icons/static/rainy-3.svg';
import thunderstormDay from '../icons/static/isolated-thunderstorms-day.svg';
import thunderstormNight from '../icons/static/scattered-thunderstorms-night.svg';
import snow from '../icons/static/snowy-3.svg';
import fog from '../icons/static/fog.svg';
import wind from '../icons/static/wind.svg';

interface WeatherIconProps {
  type: string;
  isDay: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ type, isDay }) => {
  const getIconSrc = () => {
    switch (type.toLowerCase()) {
      case 'clear':
        return isDay ? clearDay : clearNight;
      case 'few clouds':
      case 'scattered clouds':
        return isDay ? cloudyDay : cloudyNight;
      case 'broken clouds':
      case 'overcast clouds':
        return cloudy;
      case 'shower rain':
      case 'rain':
        return isDay ? rainDay : rainNight;
      case 'light rain':
      case 'drizzle':
        return drizzle;
      case 'thunderstorm':
        return isDay ? thunderstormDay : thunderstormNight;
      case 'snow':
        return snow;
      case 'mist':
      case 'fog':
        return fog;
      case 'windy':
        return wind;
      default:
        return isDay ? clearDay : clearNight;
    }
  };

  return (
    <div className="weather-icon" style={{ width: '100px', height: '100px' }}>
      <img 
        src={getIconSrc()} 
        alt={type} 
        className="weather-icon-image"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
      />
    </div>
  );
};

export default WeatherIcon;