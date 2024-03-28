"use client";

// Define the structure for billing records
type BillingRecord = {
    period: string;
    amount: number;
    status: "Paid" | "Unpaid";
    dueDate?: string;
};

const billingRecords: BillingRecord[] = [
    {
        period: "February 2024",
        amount: 176.96,
        status: "Unpaid",
        dueDate: "15 Feb 2024",
    },
    { period: "January 2024", amount: 176.96, status: "Paid" },
    { period: "December 2023", amount: 175.14, status: "Paid" },
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
        <div className="flex-1 overflow-y-auto p-10">
            <div className="container mx-auto rounded bg-white p-6 shadow">
                <h1 className="mb-6 text-xl font-bold text-gray-900">
                    Billing & Payments
                </h1>

                {/* Billing History Chart Placeholder */}
                <div className="mb-6">Chart Placeholder</div>

                {/* Manage Payments Section */}
                <div className="mb-6">
                    <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                        Make payment
                    </button>
                    <button className="ml-4 rounded bg-gray-300 px-4 py-2 font-bold text-black hover:bg-gray-400">
                        All payments
                    </button>
                </div>

                {/* Current and Past Bills */}
                <div>
                    {billingRecords.map((record, index) => (
                        <div
                            key={index}
                            className="my-2 flex items-center justify-between rounded-lg bg-gray-100 p-4"
                        >
                            <div>
                                <h3 className="font-medium">{record.period}</h3>
                                <p>€{record.amount.toFixed(2)}</p>
                                {record.dueDate && (
                                    <p>Due by {record.dueDate}</p>
                                )}
                            </div>
                            <div>
                                <button
                                    onClick={() => handleDownload(record)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Download
                                </button>
                                {record.status === "Unpaid" && (
                                    <button
                                        onClick={() => handlePayment(record)}
                                        className="ml-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                                    >
                                        Pay
                                    </button>
                                )}
                                {record.status === "Paid" && (
                                    <span className="ml-4 text-green-600">
                                        Paid
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
