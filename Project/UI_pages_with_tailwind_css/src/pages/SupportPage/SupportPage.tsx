import React, { useState } from 'react';
import DoctorSidebar from '../../components/DoctorSidebar/DoctorSidebar';

const faqs = [
  {
    question: 'How do I book an appointment with a GP?',
    answer:
      'To book an appointment, simply visit our homepage and click on the "Book Appointment" button. You\'ll need to select your preferred GP, choose a suitable date and time from the available slots, and fill in your personal details to confirm the booking.',
  },
  // ... Include other FAQ items here
];

const SupportPage = () => {
  const [openFAQs, setOpenFAQs] = useState<{ [key: number]: boolean }>({});

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prevOpenFAQs) => ({
      ...prevOpenFAQs,
      [index]: !prevOpenFAQs[index],
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 p-10 pl-64 overflow-y-auto">
        <div className="container mx-auto bg-white shadow rounded p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Help/Support</h1>
          <div>
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="text-left w-full text-gray-900 font-semibold py-2"
                >
                  {faq.question}
                </button>
                {openFAQs[index] && (
                  <p className="text-gray-600 mt-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
