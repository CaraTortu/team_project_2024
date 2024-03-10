// src/pages/MainPage/MainPage.tsx
import React from 'react';
import TopBar from '../../components/TopBar';

const MainPage: React.FC = () => {
  return (
    <div>
      <TopBar />
      <div className="greeting-message">
        Welcome to the GP Appointment System!
      </div>
      {/* Additional content of the main page goes here */}
    </div>
  );
};

export default MainPage;
