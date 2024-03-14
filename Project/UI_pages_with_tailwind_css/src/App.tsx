// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage'; // Make sure this import path is correct
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage/DoctorDashboardPage';
import BookAppointmentPage from './pages/BookAppointmentPage/BookAppointmentPage';
import DoctorMyInfoPage from './pages/DoctorMyInfoPage/DoctorMyInfoPage';
import SupportPage from './pages/SupportPage/SupportPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
          <Route path="/doctor-info" element={<DoctorMyInfoPage />} />
          <Route path="/help" element={<SupportPage />} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
