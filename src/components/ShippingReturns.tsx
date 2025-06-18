'use client';

import { useState } from 'react';

const ShippingReturns = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
    <div className="bg-[#1f7285] rounded-lg p-6" >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left text-white text-lg font-semibold py-4"
      >
        Shipping & Returns
        <svg
          className={`inline-block ml-2 w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="mt-4 space-y-6 text-white">
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping</h3>
            <p>We ship via USPS.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Returns</h3>
            <p>For return inquiries, please email <a href="mailto:info@earlthemonster.com" className="text-yellow-300 hover:text-yellow-200">info@earlthemonster.com</a>. Please note that <u>personalized or signed merchandise is not returnable</u>.</p>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ShippingReturns; 