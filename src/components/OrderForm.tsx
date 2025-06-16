'use client';

import { useState } from 'react';

interface ShippingOption {
  name: string;
  price: string;
  deliveryTime: string;
}

interface PaymentMethod {
  name: string;
  icon: string;
}

interface OrderFormProps {
  shippingOptions: ShippingOption[];
  paymentMethods: PaymentMethod[];
  paymentTitle: string;
}

const OrderForm = ({ shippingOptions, paymentMethods, paymentTitle }: OrderFormProps) => {
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);

  return (
    <div className="bg-[#1f7285] rounded-lg p-6 md:border-l" style={{borderLeft: '1px solid rgb(41, 149, 174)', borderLeftWidth: undefined}}>
      <h2 className="text-2xl font-semibold text-white mb-6">Shipping Options</h2>
      <div className="space-y-4">
        {shippingOptions.map((option, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 cursor-pointer ${
              selectedShipping.name === option.name
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            }`}
            onClick={() => setSelectedShipping(option)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`font-medium ${selectedShipping.name === option.name ? 'text-gray-900' : 'text-white'}`}>{option.name}</h3>
                <p className={`text-sm ${selectedShipping.name === option.name ? 'text-gray-500' : 'text-white'}`}>{option.deliveryTime}</p>
              </div>
              <p className={`text-lg font-medium ${selectedShipping.name === option.name ? 'text-gray-900' : 'text-white'}`}>${option.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          {paymentTitle}
        </h3>
        <div className="flex space-x-4">
          {paymentMethods.map((method, index) => (
            <button
              key={index}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {method.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          className="inline-flex items-center bg-[#ffe03b] text-black font-bold rounded-full transition-colors shadow-sm"
          style={{boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '6px 18px'}}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default OrderForm; 