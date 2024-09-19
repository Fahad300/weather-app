import React, { ReactNode, useState } from 'react';
import { useTheme } from './ThemeContext';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const onToggleUnit = () => {
    setUnit(prevUnit => prevUnit === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className={`layout ${theme}`}>
      <Header unit={unit} onToggleUnit={onToggleUnit} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;