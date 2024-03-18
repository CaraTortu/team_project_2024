// src/pages/BookAppointmentPage/BookAppointmentPage.tsx
import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import WeekCalendar from '../../components/WeekCalendar';
const BookAppointmentPage: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);


  const appointments = [
    { time: '9:15', doctor: 'Dr Jane Smith', type: 'All day GP' },

    // ... add other appointments here
  ];

  const handleSelectAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
  };

  return (
    <div className="book-appointment-page">
     <Sidebar />
      <div className="appointment-content">
        <div className="calendar">
          {/* Calendar here */}
        </div>
        <div className="appointment-list">
          <h2>Thursday, 19 February 2024</h2>
          {appointments.map((appointment, index) => (
            <div
              key={index}
              className={`appointment-item ${
                selectedAppointment === appointment ? 'selected' : ''
              }`}
              onClick={() => handleSelectAppointment(appointment)}
            >
              <div className="appointment-time">{appointment.time}</div>
              <div className="appointment-info">
                <div>{appointment.doctor}</div>
                <div>{appointment.type}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="select-appointment-btn">
          Select This Appointment
        </button>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
