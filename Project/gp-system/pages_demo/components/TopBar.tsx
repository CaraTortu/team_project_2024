// src/components/TopBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface TopBarProps {
  onLogin?: () => void; // Now optional and can be removed if not used
}

const TopBar: React.FC<TopBarProps> = () => {
  return (
    <header className="App-header">
      <Link to="/login" className="login-button">Login/Register</Link>
    </header>
  );
};

export default TopBar;
