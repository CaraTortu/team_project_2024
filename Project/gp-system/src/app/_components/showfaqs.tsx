"use client"

import { useState } from "react";

const SupportPageFAQS: React.FC<{ faqs: {question: string, answer: string}[] }> = ({ faqs }) => {
  const [openFAQs, setOpenFAQs] = useState<{ [key: number]: boolean }>({});

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prevOpenFAQs) => ({
      ...prevOpenFAQs,
      [index]: !prevOpenFAQs[index],
    }));
  };

  return (
      <div className="flex items-center">
        <div className="container mx-auto bg-white flex flex-col items-center rounded p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Help/Support</h1>
          <div className="flex flex-col gap-4 w-2/3">
            {faqs.map((faq, index) => (
              <div key={index}>
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
  );
};

export { SupportPageFAQS }
