"use client";

import Sidebar from '../../components/Sidebar/Sidebar';

// Define the structure for billing records
type BillingRecord = {
  period: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
  dueDate?: string;
};

const billingRecords: BillingRecord[] = [
  { period: 'February 2024', amount: 176.96, status: 'Unpaid', dueDate: '15 Feb 2024' },
  { period: 'January 2024', amount: 176.96, status: 'Paid' },
  { period: 'December 2023', amount: 175.14, status: 'Paid' },
  // ... more records
];

export default function BillingPage() {
  // Handle payment logic
  const handlePayment = (record: BillingRecord) => {
    console.log(`Paying for period: ${record.period}`);
    // Payment logic goes here
  };

  // Handle download statement logic
  const handleDownload = (record: BillingRecord) => {
    console.log(`Downloading statement for period: ${record.period}`);
    // Download logic goes here
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10 pl-64 overflow-y-auto">
        <div className="container mx-auto bg-white shadow rounded p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Billing & Payments</h1>
          
          {/* Billing History Chart Placeholder */}
          <div className="mb-6">Chart Placeholder</div>
          
          {/* Manage Payments Section */}
          <div className="mb-6">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Make payment
            </button>
            <button className="ml-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
              All payments
            </button>
          </div>

          {/* Current and Past Bills */}
          <div>
            {billingRecords.map((record, index) => (
              <div key={index} className="flex justify-between items-center p-4 my-2 bg-gray-100 rounded-lg">
                <div>
                  <h3 className="font-medium">{record.period}</h3>
                  <p>€{record.amount.toFixed(2)}</p>
                  {record.dueDate && <p>Due by {record.dueDate}</p>}
                </div>
                <div>
                  <button onClick={() => handleDownload(record)} className="text-blue-600 hover:text-blue-800">
                    Download
                  </button>
                  {record.status === 'Unpaid' && (
                    <button onClick={() => handlePayment(record)} className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Pay
                    </button>
                  )}
                  {record.status === 'Paid' && <span className="ml-4 text-green-600">Paid</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
