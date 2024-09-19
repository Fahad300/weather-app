import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid, faThermometerHalf, faTemperatureHigh, faCloudSun, faTint, faWind } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import WeatherIcon from './WeatherIcon';
import './WeatherInfo.css';

interface WeatherInfoProps {
  data: {
    city: string;
    temperature: number;
    feelsLike: number;
    description: string;
    humidity: number;
    windSpeed: number;
  };
  unit: 'metric' | 'imperial';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ data, unit, isFavorite, onToggleFavorite }) => {
  const isDay = new Date().getHours() >= 6 && new Date().getHours() < 18;

  const getWeatherAdvice = () => {
    const { description, windSpeed, feelsLike } = data;
    const coldTemp = unit === 'metric' ? 10 : 50;
    const coolTemp = unit === 'metric' ? 15 : 59;
    const warmTemp = unit === 'metric' ? 25 : 77;
    const hotTemp = unit === 'metric' ? 30 : 86;
    const highWind = unit === 'metric' ? 10 : 22;

    let advice = `It feels like ${Math.round(feelsLike)}°${unit === 'metric' ? 'C' : 'F'}. `;
    let icons: Array<"umbrella" | "wind" | "cold" | "hot" | "snow" | "mild"> = [];

    if (description.toLowerCase().includes('rain')) {
      advice += "Don't forget your umbrella! ";
      icons.push('umbrella');
    }
    if (windSpeed > highWind) {
      advice += "It's windy, so hold onto your hat! ";
      icons.push('wind');
    }
    if (feelsLike < coldTemp) {
      advice += "Bundle up, it's quite cold out there! ";
      icons.push('cold');
    } else if (feelsLike < coolTemp) {
      advice += "It's a bit chilly, consider wearing a light jacket. ";
      icons.push('cold');
    } else if (feelsLike > hotTemp) {
      advice += "It's very hot! Stay hydrated and find some shade! ";
      icons.push('hot');
    } else if (feelsLike > warmTemp) {
      advice += "It's warm, perfect for outdoor activities. Don't forget sunscreen! ";
      icons.push('hot');
    } else {
      advice += "The temperature is mild. Enjoy your day! ";
      icons.push('mild');
    }
    if (description.toLowerCase().includes('snow')) {
      advice += "There's snow in the forecast. Time for some warm boots and a cozy jacket! ";
      icons.push('snow');
    }

    return { text: advice.trim(), icons };
  };

  const { text: adviceText, icons: adviceIcons } = getWeatherAdvice();

  return ( 
    <div className="weather-info my-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h2>
            {data.city}
            <button className="favorite-button" onClick={onToggleFavorite}>
              <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStarRegular} />
            </button>
          </h2>
          <div className="d-flex mt-3">
            <div className="card me-3">
              <div className="card-body">
                <h5 className="card-title">Temp</h5>
                <p className="card-text">
                  <FontAwesomeIcon icon={faThermometerHalf} /> {Math.round(data.temperature)}°{unit === 'metric' ? 'C' : 'F'}
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title"><FontAwesomeIcon icon={faCloudSun} /> {data.description.charAt(0).toUpperCase() + data.description.slice(1)}</h5>
                <p className="card-text">
                <p><FontAwesomeIcon icon={faTemperatureHigh} /> Feels like: {Math.round(data.feelsLike)}°{unit === 'metric' ? 'C' : 'F'}</p>
                </p>
              </div>
            </div>
          </div>
          <div className='d-flex flex-column mt-3'>
            <p><FontAwesomeIcon icon={faTint} /> Humidity: {Math.round(data.humidity)}%</p>
            <p><FontAwesomeIcon icon={faWind} /> Wind Speed: {Math.round(data.windSpeed)} {unit === 'metric' ? 'm/s' : 'mph'}</p>
          </div>
          <p><strong>Advice:</strong> {adviceText}</p>
        </div>
        <div className="weather-icons">
          {adviceIcons.map((icon, index) => (
            <WeatherIcon key={index} type={icon} isDay={isDay} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;