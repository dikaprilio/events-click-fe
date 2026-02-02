'use client';

import { useState } from 'react';
import { faqs } from '@/data/faq';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [isTyping, setIsTyping] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        if (openIndex === index) {
            setOpenIndex(null);
            setIsTyping(null);
        } else {
            setOpenIndex(index);
            setIsTyping(index);
            // Fake replying animation for 0.3 seconds
            setTimeout(() => {
                setIsTyping(null);
            }, 300);
        }
    };

    return (
        <section className="py-24 bg-dots relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground animate-fade-in-up">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="flex flex-col space-y-0">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="flex flex-col space-y-4 animate-fade-in-up"
                            style={{ animationDelay: `${0.1 * index}s` }}
                        >
                            {/* Question Bubble (Sender) */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className={`relative max-w-[85%] md:max-w-[70%] px-6 py-4 rounded-3xl rounded-tr-none transition-all duration-300 flex items-center gap-4 text-left group border-none ${openIndex === index
                                        ? 'bg-primary-dark shadow-lg shadow-primary/30'
                                        : 'bg-primary hover:bg-primary-light shadow-md shadow-primary/20'
                                        }`}
                                >
                                    <span className="font-medium text-lg leading-snug text-white">
                                        {faq.question}
                                    </span>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index
                                        ? 'bg-white/30 text-white'
                                        : 'bg-white/20 text-white'
                                        }`}>
                                        <svg
                                            className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                </button>
                            </div>

                            {/* Answer Bubble (Receiver) */}
                            <div
                                className={`flex justify-start transition-all duration-500 ease-in-out ${openIndex === index
                                    ? 'opacity-100 transform translate-y-0 max-h-[500px]'
                                    : 'opacity-0 transform -translate-y-4 max-h-0 overflow-hidden'
                                    }`}
                            >
                                <div className="max-w-[85%] md:max-w-[75%] bg-white dark:bg-zinc-900 px-7 py-5 rounded-3xl rounded-tl-none shadow-md border border-gray-100 dark:border-white/5 relative min-w-[80px] min-h-[50px] flex items-center">
                                    {isTyping === index ? (
                                        <div className="flex gap-1.5 items-center justify-center w-full">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg animate-fade-in">
                                            {faq.answer}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
