import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyEmailMutation } from "../apiSlice/apiSlice";
import { FaKey } from "react-icons/fa";

const VerifyEmailPage = () => {
  const navigateTo = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();
  const [code, setCode] = useState("");

  const handleChange = (event) => {
    //(/\D/g, ""), It ensures that only digits (0-9) are allowed. slice(0, 6) Restricting length to a max limit of 6 digits
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await verifyEmail(code);
      navigateTo("/");
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4 uppercase tracking-wide">
          Verify Email
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <FaKey className="absolute left-4 top-4 text-gray-500 text-lg" />
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={handleChange}
              required
              className="pl-12 p-4 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 shadow-sm text-center tracking-widest text-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 text-white font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity duration-300 shadow-lg"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
