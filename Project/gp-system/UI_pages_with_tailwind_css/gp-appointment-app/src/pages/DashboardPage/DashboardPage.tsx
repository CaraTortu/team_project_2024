import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';

const DashboardPage: React.FC = () => {
  // get upcoming appointments from the server
  const upcomingAppointments = [
    { id: 1, title: 'Blood Test', date: '24/02/2024, 10:30 AM' },
    { id: 2, title: 'Breast X-ray', date: '18/02/2024, 3:15 PM' },
    // More appointments...
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <div className="flex-grow p-4">
          <h1 className="text-xl font-bold mb-4">Upcoming Appointments</h1>
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white p-4 rounded-lg shadow mb-4">
              <h2 className="text-lg font-bold">{appointment.title}</h2>
              <p className="text-gray-600">{appointment.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
