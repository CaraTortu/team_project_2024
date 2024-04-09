// PaymentStatusPage.tsx
"use client";

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentStatusPage() {
  const location = useLocation();
  const navigate = useNavigate();


  //JUST Example data!!!!
  const exampleAppointmentDetails = {
    id: '12345',
    date: '2024-06-01',
    time: '14:00',
    gpName: 'Dr. Alex Smith'
  };
  const { paymentSuccess, appointmentDetails } = location.state || { paymentSuccess: true, appointmentDetails: exampleAppointmentDetails };

  const handleBackToAppointments = () => {
    navigate('/dashboard'); // Redirect to the dashboard/upcoming appointment page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div className="mb-4 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Appointment Payment
          </h2>
        </div>
        {paymentSuccess ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* Success Icon */}
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  {/* \/ */}<path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L10 10.586 8.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l6-6a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Your payment for the GP appointment was successful.
                </p>
                <p className="mt-2 text-sm text-green-700">
                  A receipt has been sent to your email. Please check your inbox.
                </p>
                {appointmentDetails && (
                  <ul className="mt-4 text-sm text-green-700 list-disc list-inside">
                    <ul>ID: {appointmentDetails.id}</ul>
                    <ul>Date: {appointmentDetails.date}</ul>
                    <ul>Time: {appointmentDetails.time}</ul>
                    <ul>GP: {appointmentDetails.gpName}</ul>
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* Error Icon */}
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  {/* (X) */}<path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7-4.418 0-8-3.134-8-7s3.582-7 8-7c4.418 0 8 3.134 8 7zM4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="rounded-md bg-red-50 p-4">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Payment Failed</h1>
                <p>There was a problem processing your payment for the GP appointment.</p>
                <p>
                  Please attempt the payment again, or
                  <button onClick={() => navigate('/support')} // Redirect to support page
                    className="text-blue-600 hover:text-blue-800 inline ml-1">
                  contact support
                  </button>
                  for further assistance.
                </p>
                <div className="mt-4">
                  <button
                    onClick={handleBackToAppointments}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6">
          <button
            onClick={handleBackToAppointments}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    </div>
  );
}
