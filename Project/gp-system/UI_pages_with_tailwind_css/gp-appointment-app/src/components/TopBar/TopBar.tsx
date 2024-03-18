// src/components/TopBar/TopBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const TopBar: React.FC = () => {
  return (
    <div className="bg-blue-600 px-5 py-3 flex justify-between items-center">
      <Link to="/" className="text-white text-2xl font-bold">
        GP Appointment System
      </Link>
      <div>
        <Link to="/login" className="text-white px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 transition duration-300">
          Register/Login
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
