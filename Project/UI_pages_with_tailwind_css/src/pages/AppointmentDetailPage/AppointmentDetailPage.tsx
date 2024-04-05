// AppointmentDetailPage.tsx
"use client";

import React, { useState, useEffect } from 'react';

type PatientHistoryEntry = {
  date: string;
  notes: string;
  diagnosis: string;
};

type AppointmentDetails = {
  notes: string;
  diagnosis: string;
};

export default function AppointmentDetailPage() {
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    notes: '',
    diagnosis: '',
  });
  const [patientHistory, setPatientHistory] = useState<PatientHistoryEntry[]>([]);

  useEffect(() => {
    // On component mount, fetch the patient's history
    setPatientHistory(fetchPatientHistory());
  }, []);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAppointmentDetails({ ...appointmentDetails, notes: e.target.value });
  };

  const handleDiagnosisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentDetails({ ...appointmentDetails, diagnosis: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here, integrate with backend to post the data
    console.log('Submitting appointment details:', appointmentDetails);
    // After successful submission, you might want to clear the form or navigate the user elsewhere
  };

  // Mock function to fetch patient history
  const fetchPatientHistory = (): PatientHistoryEntry[] => {
    return [
      // Replace with actual fetching logic and data
      { date: '2021-04-20', notes: 'Patient complained of chest pain.', diagnosis: 'Acid reflux.' },
      { date: '2021-05-15', notes: 'Follow-up appointment.', diagnosis: 'Symptoms improved with medication.' },
      // More entries...
    ];
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Appointment Details</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes:
          </label>
          <textarea
            id="notes"
            rows={3}
            className="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2" // Increased padding here
            value={appointmentDetails.notes}
            onChange={handleNotesChange}
            />

            
        </div>

        <div className="mb-4">
          <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
            Diagnosis:
          </label>
          <input
            id="diagnosis"
            type="text"
            className="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2" // Increased padding here
            value={appointmentDetails.diagnosis}
            onChange={handleDiagnosisChange}
            />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Save Appointment Details
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Appointment History</h2>
        {patientHistory.length > 0 ? (
          patientHistory.map((entry, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg mb-3">
              <p><strong>Date:</strong> {entry.date}</p>
              <p><strong>Notes:</strong> {entry.notes}</p>
              <p><strong>Diagnosis:</strong> {entry.diagnosis}</p>
            </div>
          ))
        ) : (
          <p>No past appointments found.</p>
        )}
      </div>
    </div>
  );
}
