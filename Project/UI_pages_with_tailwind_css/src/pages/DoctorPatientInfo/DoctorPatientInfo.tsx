"use client";

import React, { useState } from 'react';
import DoctorSidebar from '../../components/DoctorSidebar/DoctorSidebar';

type MedicalHistoryEntry = {
    date: string;
    diagnosis: string;
    treatment: string;
  };
  
  type PatientRecord = {
    id: string;
    name: string;
    patientNumber: string;
    dateOfBirth: string;
    medicalHistory: MedicalHistoryEntry[];
    allergies: string[];
    currentMedications: string[];
    // more fields required?
  };
  
const patientRecords: PatientRecord[] = [
    {
      id: '1',
      name: 'John Doe',
      patientNumber: 'P001',
      dateOfBirth: '1990-04-01',
      medicalHistory: [
        { date: '2022-01-15', diagnosis: 'Type 2 Diabetes', treatment: 'Metformin 500mg daily' },
        { date: '2022-03-10', diagnosis: 'Hypertension', treatment: 'Lisinopril 10mg daily' },
      ],
      allergies: ['Peanuts', 'Penicillin'],
      currentMedications: ['Metformin', 'Lisinopril'],
    },
    {
      id: '2',
      name: 'Jane Smith',
      patientNumber: 'P002',
      dateOfBirth: '1985-08-12',
      medicalHistory: [
        { date: '2021-11-20', diagnosis: 'Asthma', treatment: 'Inhaled corticosteroids' },
        { date: '2022-02-14', diagnosis: 'Anxiety', treatment: 'Sertraline 50mg daily' },
      ],
      allergies: ['Ibuprofen'],
      currentMedications: ['Sertraline'],
    },
    {
      id: '3',
      name: 'Michael Brown',
      patientNumber: 'P003',
      dateOfBirth: '1978-02-12',
      medicalHistory: [
        { date: '2022-02-05', diagnosis: 'Eczema', treatment: 'Topical steroids' },
        { date: '2022-03-22', diagnosis: 'Seasonal Allergies', treatment: 'Cetirizine 10mg daily' },
      ],
      allergies: ['Dust mites'],
      currentMedications: ['Cetirizine'],
    },
    {
      id: '4',
      name: 'Linda White',
      patientNumber: 'P004',
      dateOfBirth: '1995-05-30',
      medicalHistory: [
        { date: '2021-07-19', diagnosis: 'Iron Deficiency Anemia', treatment: 'Oral iron supplements' },
        { date: '2022-01-10', diagnosis: 'Migraines', treatment: 'Sumatriptan as needed' },
      ],
      allergies: ['Shellfish'],
      currentMedications: ['Iron supplements'],
    },
    {
      id: '5',
      name: 'Emily Johnson',
      patientNumber: 'P005',
      dateOfBirth: '1989-11-15',
      medicalHistory: [
        { date: '2021-09-23', diagnosis: 'Hypothyroidism', treatment: 'Levothyroxine 100mcg daily' },
        { date: '2022-02-28', diagnosis: 'Generalized Anxiety Disorder', treatment: 'Escitalopram 10mg daily' },
      ],
      allergies: ['Latex'],
      currentMedications: ['Levothyroxine', 'Escitalopram'],
    },
  ];
  
  
  export default function DoctorPatientInfoPage() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredRecords, setFilteredRecords] = useState<PatientRecord[]>(patientRecords);
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = event.target.value.toLowerCase();
      setSearchTerm(searchValue);
      setFilteredRecords(patientRecords.filter(record => record.patientNumber.toLowerCase().includes(searchValue)));
    };
  
    return (
      <div className="flex h-screen bg-gray-100">
        <DoctorSidebar />
        <div className="flex-1 p-10 pl-64 overflow-y-auto">
          <div className="container mx-auto bg-white shadow rounded p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">Patient Records</h1>
            <input
              type="text"
              placeholder="Search by patient number..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="mb-6 border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            />
            {filteredRecords.length > 0 ? (
              filteredRecords.map(record => (
                <div key={record.id} className="p-4 mb-4 bg-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold">{record.name}</h3>
                  <p><strong>Patient Number:</strong> {record.patientNumber}</p>
                  <p><strong>Date of Birth:</strong> {record.dateOfBirth}</p>
                  <p><strong>Allergies:</strong> {record.allergies.join(', ')}</p>
                  <p><strong>Current Medications:</strong> {record.currentMedications.join(', ')}</p>
                  <div>
                    <strong>Medical History:</strong>
                    <ul>
                      {record.medicalHistory.map((entry, index) => (
                        <li key={index}>
                          {entry.date}: {entry.diagnosis} - {entry.treatment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p>No records found for "{searchTerm}".</p>
            )}
          </div>
        </div>
      </div>
    );
  }