import React, { useState } from 'react';
import DoctorSidebar from '../../components/DoctorSidebar/DoctorSidebar';

const faqs = [
  {
    question: '1. How do I book an appointment with a GP?',
    answer:
      'To book an appointment, simply visit our homepage and click on the "Book Appointment" button. You\'ll need to select your preferred GP, choose a suitable date and time from the available slots, and fill in your personal details to confirm the booking.',
  },
  {
    question: '2. Can I choose my preferred GP? ',
    answer:
      'Yes, our system allows you to choose your preferred GP based on their availability. If your preferred GP is not available, you can select another GP or choose a different date and time.',
  },
  {
    question: '3. What information do I need to provide to book an appointment? ',
    answer:
      'You\'ll need to provide your full name, contact details, and reason for the visit. If you are a returning patient, you may also need to provide your patient ID.',
  },
  {
    question: '4. How far in advance can I book an appointment?',
    answer:
      'You can book appointments up to 3 months in advance. Availability varies based on the GP\'s schedule.',
  },
  {
    question: '5. Can I cancel or reschedule my appointment online?',
    answer:
      'Yes, you can cancel or reschedule your appointment by logging into your account on our website. Please note that changes must be made at least 24 hours before your scheduled appointment to avoid a cancellation fee.',
  },
  {
    question: '6. Is there a fee for booking an appointment online?',
    answer:
      'No, there is no additional fee for booking an appointment through our website. However, standard consultation fees apply.',
  },
  {
    question: '7. What should I do if I can\'t find a suitable appointment time? ',
    answer:
      'If you can\'t find a suitable time, you can join our waiting list. We\'ll notify you if an earlier appointment becomes available.',
  },
  {
    question: '8. What happens if I miss my appointment? ',
    answer:
      'If you miss your appointment without providing at least 24 hours\' notice, you may be charged a missed appointment fee. Please contact us as soon as possible if you know you won\'t be able to make your appointment.',
  },
  {
    question: '9. How do I know if my appointment has been successfully booked? ',
    answer:
      'After booking, you will receive a confirmation email with the details of your appointment. Please ensure that you provide a valid email address to receive this confirmation.',
  },
  {
    question: '10. How secure is my personal information? ',
    answer:
      'We take your privacy seriously and comply with all relevant data protection regulations. Your information is securely stored and is only used for your medical care and appointment scheduling.',
  },
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
