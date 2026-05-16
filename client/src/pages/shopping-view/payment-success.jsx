/*-------------------------------------
Writing code and logic to show success page afterr payement
-------------------------------------*/

import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const buttonStyle =
    "mt-4 w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-3 text-white font-medium shadow-md hover:opacity-90 active:scale-95 transition";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50">
      <div className="relative w-[380px] rounded-2xl bg-white p-8 shadow-2xl">

        {/* Close Button */}
        <button
          onClick={() => handleNavigate("/shop/home")}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-xl font-semibold text-gray-800">
          Payment Successful 🎉
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500 leading-relaxed">
          Your payment has been successfully processed. Now you can go to the
          homepage & discover new products.
        </p>

        {/* Buttons */}
        <button
          onClick={() => handleNavigate("/shop/home")}
          className={buttonStyle}
        >
          Continue shopping
        </button>

        <button
          onClick={() => handleNavigate("/shop/account")}
          className={buttonStyle}
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
