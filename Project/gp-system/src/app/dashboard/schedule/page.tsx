"use client"
import React, { useState, useEffect } from 'react';
import { format, addDays} from 'date-fns';

type PatientInfo = {
  id: string;
  name: string;
  dob: string; // Date of birth
  problem: string; // Patient's current problem or reason for the appointment
  history: string; // Medical history summary or a link to detailed history
  // Add more fields as necessary
};

type Appointment = {
  id: number;
  time: string;
  patient: PatientInfo;
};


const today = new Date();
const mockAppointments: Appointment[] = [
  {
    id: 1,
    time: `${format(today, 'yyyy-MM-dd')} 9:00`,
    patient: {
      id: '12345',
      name: 'John Doe',
      dob: '1990-01-01',
      problem: 'patient problem',
      history: 'Short medical history or link to full history...'
    },
  },
  {
    id: 2,
    time: `${format(today, 'yyyy-MM-dd')} 9:15`,
    patient: {
      id: '23456',
      name: 'Jane Smith',
      dob: '1985-05-15',
      problem: 'patient problem',
      history: 'Short medical history or link to full history...'
    },
  },
  // ...more appointments
];




const DoctorDashboardPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
  // This is a placeholder for fetching the data
  const todayAppointments = mockAppointments.filter(appointment => {
    // Compare the date part of the appointment time with the current date
    return appointment.time.startsWith(format(currentDate, 'yyyy-MM-dd'));
  });

  setAppointments(todayAppointments);
}, [currentDate]);

  const goToPreviousDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, -1));
  };

  const goToNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };

  return (
    <div className="flex">
      <div className="flex-grow p-4 ">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={goToPreviousDay} className="px-4 py-2 text-xl">&larr;</button>
          <h2 className="text-lg font-semibold">{format(currentDate, 'eeee, MMMM do yyyy')}</h2>
          <button onClick={goToNextDay} className="px-4 py-2 text-xl">&rarr;</button>
        </div>
        <div className="p-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-col p-2 my-2 bg-gray-100 rounded-lg">
                <span className="font-medium">{appointment.time} - {appointment.patient.name}</span>
                <span className="text-sm text-gray-600">DOB: {appointment.patient.dob}</span>
                <span className="text-sm text-gray-600">ID: {appointment.patient.id}</span>
                <span className="text-sm text-gray-600">Problem: {appointment.patient.problem}</span>
                <span className="text-sm text-gray-600">History: {appointment.patient.history}</span>
                {/* Optionally, add a button to view the full medical history */}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No appointments for this day.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
