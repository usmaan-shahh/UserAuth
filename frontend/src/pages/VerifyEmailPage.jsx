import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyEmailMutation } from "../apiSlice/apiSlice";
import { FaKey } from "react-icons/fa";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6); //(/\D/g, ""), It ensures that only digits (0-9) are allowed. slice(0, 6) Restricting length to a max limit of 6 digits
    setCode(value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (code.length !== 6) {
      setErrorMessage("Code must be exactly 6 digits.");
      return;
    }
    try {
      await verifyEmail({ code }).unwrap();
      navigate("/");
    } catch (error) {
      setErrorMessage("Invalid verification code. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          Verify Email
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter the 6-digit code sent to your email.
        </p>

        {errorMessage && (
          <p className="text-sm text-red-500 text-center mb-4">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaKey className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="text"
              name="code"
              value={code}
              onChange={handleChange}
              required
              maxLength="6"
              className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-center tracking-widest text-lg"
              placeholder="123456"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600 transition"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
