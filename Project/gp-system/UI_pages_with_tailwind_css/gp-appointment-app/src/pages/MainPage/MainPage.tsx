import React from 'react';
import TopBar from '../../components/TopBar/TopBar';

const MainPage: React.FC = () => {
  return (
    <div>
      <TopBar />
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-semibold text-center">
          Welcome to the GP Appointment System
        </h1>
      </div>
    </div>
  );
};

export default MainPage;
