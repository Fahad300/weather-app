import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  unit: 'metric' | 'imperial';
  onToggleUnit: () => void;
}

const Header: React.FC<HeaderProps> = ({ unit, onToggleUnit }) => {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getThemeInfo = () => {
    const hour = currentTime.getHours();
    if (theme === 'light') {
      return hour >= 6 && hour < 18 ? 'Day' : 'Manual Light';
    } else {
      return hour >= 18 || hour < 6 ? 'Night' : 'Manual Dark';
    }
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">tempTide</a>
        <div className="d-flex align-items-center">
          <div className="me-3 text-end">
            <div>{formatTime(currentTime)}</div>
            <div><small>{formatDate(currentTime)}</small></div>
          </div>
          <div className="me-3">
            <FontAwesomeIcon icon={theme === 'light' ? faSun : faMoon} className="me-2" />
            <span>{getThemeInfo()}</span>
          </div>
          <button className="btn btn-outline-secondary" onClick={onToggleUnit}>
            <FontAwesomeIcon icon={faThermometerHalf} className="me-2" />
            {unit === 'metric' ? '°C' : '°F'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;