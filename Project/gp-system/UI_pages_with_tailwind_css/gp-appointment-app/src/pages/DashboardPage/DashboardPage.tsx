import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';

// Extend the Appointment type to include a state for detail visibility
type Appointment = {
  id: number;
  title: string;
  doctor: string;
  date: string;
  details: string;
  isDetailVisible?: boolean;  // Optional property to manage the visibility of details
};

const DashboardPage: React.FC = () => {
  // useState hook to manage appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([
    { id: 1, title: 'Blood Test', doctor: 'Dr. John Doe', date: '24/02/2024, 10:30 AM', details: 'Fasting required for 12 hours prior.' },
    { id: 2, title: 'Breast X-ray', doctor: 'Dr. Jane Smith', date: '18/02/2024, 3:15 PM', details: 'No metallic accessories.' },
    { id: 3, title: 'Dental Checkup', doctor: 'Dr. Sarah Connor', date: '20/02/2024, 11:00 AM', details: 'Brush your teeth before your appointment.' },
    { id: 4, title: 'Eye Examination', doctor: 'Dr. Bruce Banner', date: '22/02/2024, 2:00 PM', details: 'Avoid driving after the appointment due to pupil dilation.' },
    { id: 5, title: 'Physical Therapy', doctor: 'Dr. Steven Strange', date: '25/02/2024, 9:00 AM', details: 'Wear comfortable clothing.' },
    { id: 6, title: 'General Consultation', doctor: 'Dr. Meredith Grey', date: '26/02/2024, 10:00 AM', details: 'Prepare a list of current medications.' },
    { id: 7, title: 'Vaccination', doctor: 'Dr. Shaun Murphy', date: '27/02/2024, 1:00 PM', details: 'Expect to remain in observation for 15 minutes post-vaccination.' },
    { id: 8, title: 'Allergy Testing', doctor: 'Dr. House', date: '28/02/2024, 10:30 AM', details: 'Avoid antihistamines for 3 days prior to the appointment.' },
    { id: 9, title: 'Nutrition Consult', doctor: 'Dr. Amy Farrah Fowler', date: '01/03/2024, 9:15 AM', details: 'Keep a food diary leading up to the appointment.' },
    { id: 10, title: 'Orthopedic Consultation', doctor: 'Dr. Hank Lawson', date: '02/03/2024, 8:30 AM', details: 'X-rays of the affected area may be taken, please bring any previous imaging you have.' },
    
  ]);

  // Function to toggle the details visibility
  const toggleDetails = (appointmentId: number) => {
    setUpcomingAppointments(upcomingAppointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, isDetailVisible: !appointment.isDetailVisible }
        : appointment
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Add pl-64 to make padding equal to the sidebar width */}
      <div className="flex-grow p-4 pl-72">
        <h1 className="text-xl font-bold mb-4">Upcoming Appointments</h1>
        {upcomingAppointments.map(appointment => (
          <div key={appointment.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{appointment.title}</h2>
                <p className="text-gray-600">With {appointment.doctor}</p>
                <p className="text-gray-600">{appointment.date}</p>
                {/* Toggle button */}
                <button
                  onClick={() => toggleDetails(appointment.id)}
                  className="text-blue-500 hover:text-blue-600 mt-2"
                >
                  {appointment.isDetailVisible ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
            {/* Details section */}
            {appointment.isDetailVisible && (
              <div className="mt-2 text-gray-600">
                <p>Details: {appointment.details}</p>
                {/* Additional details can be added here */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
