import React from 'react';

const PaymentArena = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Arena Payment System</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-blue-600 text-lg font-medium mb-2">
              Payment System Disabled
            </div>
            <p className="text-gray-600">
              The payment system has been removed from this application. 
              All bookings for your arenas are now processed without payment requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentArena;
