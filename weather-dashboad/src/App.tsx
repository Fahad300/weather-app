import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import WeatherDashboard from './components/WeatherDashboard';
import Header from './components/header';
import Footer from './components/footer';
import './styles/global-theme.css';  // Add this line
import 'leaflet/dist/leaflet.css';

const App: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const toggleUnit = () => {
    setUnit(prevUnit => prevUnit === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <ThemeProvider>
      <div className="App">
        <Header unit={unit} onToggleUnit={toggleUnit} />
        <WeatherDashboard unit={unit} onToggleUnit={toggleUnit} />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;