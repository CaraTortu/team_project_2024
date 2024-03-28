"use client";

import { useState } from "react";

const SupportPageFAQS: React.FC<{
    faqs: { question: string; answer: string }[];
}> = ({ faqs }) => {
    const [openFAQs, setOpenFAQs] = useState<{ [key: number]: boolean }>({});

    const toggleFAQ = (index: number) => {
        setOpenFAQs((prevOpenFAQs) => ({
            ...prevOpenFAQs,
            [index]: !prevOpenFAQs[index],
        }));
    };

    return (
        <div className="flex items-center">
            <div className="container mx-auto flex flex-col items-center rounded bg-white p-6">
                <h1 className="mb-6 text-3xl font-bold text-gray-900">
                    Help/Support
                </h1>
                <div className="flex w-2/3 flex-col gap-4">
                    {faqs.map((faq, index) => (
                        <div key={index}>
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full py-2 text-left font-semibold text-gray-900"
                            >
                                {faq.question}
                            </button>
                            {openFAQs[index] && (
                                <p className="mt-2 text-gray-600">
                                    {faq.answer}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { SupportPageFAQS };
